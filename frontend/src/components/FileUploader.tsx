import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, Link as LinkIcon, X, FileArchive, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload?: (file: File) => void;
  onUrlUpload?: (url: string) => void;
  className?: string;
  disabled?: boolean;
}

export function FileUploader({ 
  onFileUpload, 
  onUrlUpload, 
  className, 
  disabled 
}: FileUploaderProps) {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError('Please upload a ZIP file');
      return;
    }
    
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      onFileUpload?.(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
    disabled,
  });

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      new URL(url); // Validate URL
      onUrlUpload?.(url.trim());
      setUrl('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setError(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
          disabled={disabled}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload ZIP
        </Button>
        <Button
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
          disabled={disabled}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          From URL
        </Button>
      </div>

      {uploadMode === 'file' && (
        <div className="space-y-4">
          {!uploadedFile ? (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your ZIP file here' : 'Drag & drop a ZIP file'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div className="flex items-center space-x-3">
                <FileArchive className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {uploadMode === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/user/repo/archive/main.zip"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={disabled}
            />
            <Button type="submit" disabled={disabled || !url.trim()}>
              Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a direct link to a ZIP file or GitHub repository archive
          </p>
        </form>
      )}

      {error && (
        <div className="flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
