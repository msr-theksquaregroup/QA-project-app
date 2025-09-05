import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileUploader } from '@/components/FileUploader';
import { FileTree } from '@/components/FileTree';
import { CodePreview } from '@/components/CodePreview';
import { FileTreeSkeleton, CodePreviewSkeleton } from '@/components/SkeletonLoaders';
import { useAppStore } from '@/lib/store';
import { uploadZip, uploadByUrl, listFiles, getFileContent, uploadFilesToAgent, analyzeUploadedFiles } from '@/lib/api';
import { Button } from '@/components/ui/button';
import AgentExecution from './AgentExecution';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Folder,
  Upload,
  Archive,
  Download,
  Play,
  Bot
} from 'lucide-react';


export default function Files() {
  const queryClient = useQueryClient();
  const { selectedPaths, togglePath, clearPaths } = useAppStore();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showAgentExecution, setShowAgentExecution] = useState(false);
  const [executionFile, setExecutionFile] = useState<{code: string, filename: string} | null>(null);
  const [uploadMode, setUploadMode] = useState<'legacy' | 'agent'>('agent');

  // Fetch file tree
  const { 
    data: fileTree, 
    isLoading: isLoadingFiles, 
    error: filesError,
    refetch: refetchFiles 
  } = useQuery({
    queryKey: ['files'],
    queryFn: listFiles,
    retry: false,
  });

  // Fetch file content
  const { 
    data: fileContent, 
    isLoading: isLoadingContent 
  } = useQuery({
    queryKey: ['file-content', selectedFile],
    queryFn: () => getFileContent(selectedFile!),
    enabled: !!selectedFile,
    retry: false,
  });

  // Upload mutations
  const uploadZipMutation = useMutation({
    mutationFn: uploadZip,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Upload Successful!', {
        description: `Files uploaded and ready for analysis. Upload ID: ${data.uploadId.substring(0, 8)}...`,
      });
    },
    onError: (error: any) => {
      toast.error('Upload Failed', {
        description: error.message || 'Failed to upload the file. Please try again.',
      });
    },
  });

  const uploadUrlMutation = useMutation({
    mutationFn: uploadByUrl,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('URL Upload Successful!', {
        description: `Repository downloaded and ready for analysis. Upload ID: ${data.uploadId.substring(0, 8)}...`,
      });
    },
    onError: (error: any) => {
      toast.error('URL Upload Failed', {
        description: error.message || 'Failed to download from the provided URL. Please check the URL and try again.',
      });
    },
  });

  const handleFileUpload = (file: File) => {
    toast.info('Uploading File...', {
      description: `Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    });
    uploadZipMutation.mutate(file);
  };

  const handleUrlUpload = (url: string) => {
    toast.info('Downloading Repository...', {
      description: 'Fetching files from the provided URL...',
    });
    uploadUrlMutation.mutate(url);
  };

  const handleSelectionChange = (paths: string[]) => {
    // Clear current selection and add new paths
    clearPaths();
    paths.forEach(path => togglePath(path));
  };

  const handleAnalyzeWithAgents = () => {
    if (!selectedFile || !fileContent) {
      toast.error('Please select a file to analyze');
      return;
    }
    
    const filename = selectedFile.split('/').pop() || 'unknown.js';
    setExecutionFile({ code: fileContent, filename });
    setShowAgentExecution(true);
  };

  const handleBackFromExecution = () => {
    setShowAgentExecution(false);
    setExecutionFile(null);
  };

  // Agent file upload handler
  const handleAgentFilesUpload = async (files: File[]) => {
    try {
      toast.info('Uploading files to agent service...', {
        description: `Processing ${files.length} file(s)`
      });

      // Upload files to agent service
      const uploadResult = await uploadFilesToAgent(files);
      
      if (uploadResult.status === 'success') {
        toast.success('Files uploaded successfully!', {
          description: `${uploadResult.files_uploaded} files ready for analysis`
        });

        // Automatically start analysis with the first file
        if (uploadResult.files.length > 0) {
          const firstFile = uploadResult.files[0];
          setExecutionFile({ code: firstFile.content, filename: firstFile.name });
          setShowAgentExecution(true);
        }
      }
    } catch (error: any) {
      toast.error('Agent upload failed', {
        description: error.message || 'Failed to upload files to agent service'
      });
    }
  };



  const getLanguageFromPath = (path: string): string => {
    const ext = path.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cs': 'csharp',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'ps1': 'powershell',
    };
    return languageMap[ext || ''] || 'text';
  };

  const isUploading = uploadZipMutation.isPending || uploadUrlMutation.isPending;
  const uploadError = uploadZipMutation.error || uploadUrlMutation.error;

  // Show agent execution if triggered
  if (showAgentExecution && executionFile) {
    return (
      <AgentExecution
        code={executionFile.code}
        filename={executionFile.filename}
        onBack={handleBackFromExecution}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Files</h1>
        <p className="text-muted-foreground">
          Upload source code and select files for analysis
        </p>
      </div>

      {/* Upload Section */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upload Source Code</h2>
          <div className="flex items-center space-x-4">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUploadMode('agent')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  uploadMode === 'agent'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bot className="w-4 h-4 inline mr-1" />
                Agent Mode
              </button>
              <button
                onClick={() => setUploadMode('legacy')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  uploadMode === 'legacy'
                    ? 'bg-gray-100 text-gray-700 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Legacy Mode
              </button>
            </div>
            
            {isUploading && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-foreground" />
                <span>Uploading...</span>
              </div>
            )}
          </div>
        </div>
        
        {uploadMode === 'agent' ? (
          <div className="space-y-4">
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
              <Bot className="w-4 h-4 inline mr-2" />
              <strong>Agent Mode:</strong> Upload individual test files (.js, .ts, .cy.js) directly to the AI agents for real-time analysis
            </div>
            <FileUploader
              onFilesUpload={handleAgentFilesUpload}
              disabled={isUploading}
              acceptMultiple={true}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <Archive className="w-4 h-4 inline mr-2" />
              <strong>Legacy Mode:</strong> Upload ZIP files or GitHub repositories for traditional file management
            </div>
            <FileUploader
              onFileUpload={handleFileUpload}
              onUrlUpload={handleUrlUpload}
              disabled={isUploading}
            />
          </div>
        )}
        
        {uploadError && (
          <div className="mt-4 flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>Upload failed: {uploadError.message}</span>
          </div>
        )}
        
        {(uploadZipMutation.isSuccess || uploadUrlMutation.isSuccess) && (
          <div className="mt-4 flex items-center space-x-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span>Upload successful! Files are now available for selection.</span>
          </div>
        )}
      </div>

      {/* File Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Tree */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Project Files</h2>
              {selectedPaths.length > 0 && (
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                  {selectedPaths.length} selected
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchFiles()}
              disabled={isLoadingFiles}
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {isLoadingFiles ? (
            <FileTreeSkeleton />
          ) : filesError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Failed to load files</p>
              <p className="text-xs text-muted-foreground mt-1">
                {filesError.message}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchFiles()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : !fileTree ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/20 mb-4">
                <Archive className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No files uploaded yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Upload a ZIP file or provide a repository URL to start analyzing your code
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload ZIP
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  From URL
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <FileTree
                root={fileTree}
                selectedPaths={selectedPaths}
                onSelectionChange={handleSelectionChange}
                onFileClick={setSelectedFile}
                selectedFile={selectedFile}
              />
            </div>
          )}
          
          {selectedPaths.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={clearPaths}
                className="w-full"
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>

        {/* File Preview */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl font-semibold">File Preview</h2>
            </div>
            {selectedFile && fileContent && (
              <Button
                onClick={handleAnalyzeWithAgents}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Bot className="h-4 w-4" />
                <span>Analyze with Agents</span>
              </Button>
            )}
          </div>
          
          {!selectedFile ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/20 mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a file to preview</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Click on any file in the tree to view its contents with syntax highlighting
              </p>
            </div>
          ) : isLoadingContent ? (
            <CodePreviewSkeleton />
          ) : fileContent ? (
            <CodePreview
              code={fileContent}
              language={getLanguageFromPath(selectedFile)}
              filename={selectedFile.split('/').pop()}
              height="500px"
            />
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Failed to load file content</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="mt-4"
              >
                Try Another File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
