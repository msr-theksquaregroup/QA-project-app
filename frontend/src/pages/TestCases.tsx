import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CodePreview } from '@/components/CodePreview';
import { CardSkeleton } from '@/components/SkeletonLoaders';
import { useAppStore } from '@/lib/store';
import { getRun, startRun } from '@/lib/api';
import { toast } from 'sonner';
import { 
  FileText, 
  Play, 
 
  Sparkles,
  Edit,

  Zap
} from 'lucide-react';

export default function TestCases() {
  const navigate = useNavigate();
  const { lastRunId, selectedPaths, useNotebook, setLastRunId } = useAppStore();
  const [activeTab, setActiveTab] = useState<'generated' | 'custom'>('generated');
  const [customTests, setCustomTests] = useState('');

  // Fetch the last run to get generated artifacts
  const { 
    data: lastRun, 
    isLoading: isLoadingRun 
  } = useQuery({
    queryKey: ['run', lastRunId],
    queryFn: () => getRun(lastRunId!),
    enabled: !!lastRunId,
    retry: false,
  });

  const handleRerunWithCustomTests = async () => {
    if (!customTests.trim()) {
      toast.error('Missing Test Specifications', {
        description: 'Please enter your custom test requirements before running analysis.',
      });
      return;
    }

    if (selectedPaths.length === 0) {
      toast.error('No Files Selected', {
        description: 'Please select files for analysis in the Files page first.',
      });
      return;
    }

    toast.info('Starting Custom Analysis...', {
      description: `Running analysis with your custom test specifications on ${selectedPaths.length} file${selectedPaths.length !== 1 ? 's' : ''}.`,
    });

    try {
      const result = await startRun({
        paths: selectedPaths,
        use_notebook: useNotebook,
        customTests: customTests.trim(),
      });
      
      toast.success('Custom Analysis Started!', {
        description: `Run ${result.runId.substring(0, 8)}... has been queued with your custom test specifications.`,
      });
      
      setLastRunId(result.runId);
      navigate(`/runs/${result.runId}`);
      console.log('Started run with custom tests:', result.runId);
    } catch (error: any) {
      toast.error('Failed to Start Analysis', {
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
      console.error('Failed to start run:', error);
    }
  };

  const generatedArtifacts = lastRun?.artifacts || {};
  const hasGeneratedTests = Object.keys(generatedArtifacts).length > 0;

  const tabs = [
    { id: 'generated', label: 'Generated Tests', icon: Sparkles },
    { id: 'custom', label: 'Custom Input', icon: Edit },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test Cases</h1>
        <p className="text-muted-foreground">
          View generated test cases or provide custom test specifications
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'generated' && (
          <div className="space-y-6">
            {isLoadingRun ? (
              <div className="space-y-4">
                <CardSkeleton title content />
                <CardSkeleton title content />
                <CardSkeleton title content />
              </div>
            ) : !lastRunId ? (
              <div className="text-center py-16">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/20 mb-6">
                  <Sparkles className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-3">No test cases generated yet</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start your first QA analysis to automatically generate comprehensive test cases, scenarios, and documentation
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => window.location.href = '/'}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Analysis
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('custom')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Write Custom Tests
                  </Button>
                </div>
              </div>
            ) : !hasGeneratedTests ? (
              <div className="text-center py-16">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted/20 mb-6">
                  <Zap className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-3">Analysis in progress</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  The run <code className="bg-muted px-1 rounded">{lastRunId.substring(0, 8)}...</code> is still processing. Test artifacts will appear here once the analysis is complete.
                </p>
                <Button variant="outline" onClick={() => window.location.href = `/runs/${lastRunId}`}>
                  <Play className="h-4 w-4 mr-2" />
                  View Run Progress
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Generated Artifacts</h2>
                  <span className="text-sm text-muted-foreground">
                    From run: <code className="bg-muted px-1 rounded">{lastRunId.substring(0, 8)}...</code>
                  </span>
                </div>

                <div className="grid gap-6">
                  {Object.entries(generatedArtifacts).map(([key, value]) => {
                    const isStringValue = typeof value === 'string';
                    const displayValue = isStringValue ? value : JSON.stringify(value, null, 2);
                    const language = isStringValue ? 'text' : 'json';
                    
                    return (
                      <div key={key} className="space-y-2">
                        <h3 className="text-lg font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </h3>
                        <CodePreview
                          code={displayValue}
                          language={language}
                          filename={`${key}.${language === 'json' ? 'json' : 'txt'}`}
                          height="300px"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Edit className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Custom Test Specifications</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Test Requirements
                  </label>
                  <textarea
                    value={customTests}
                    onChange={(e) => setCustomTests(e.target.value)}
                    placeholder={`Enter your custom test specifications here. For example:

- Test user login functionality with valid and invalid credentials
- Verify file upload works with different file types and sizes
- Check error handling for network failures
- Test responsive design on mobile and desktop
- Validate form submissions with edge cases

Be as specific as possible about the scenarios you want to test.`}
                    className="w-full h-64 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Describe the test scenarios you want to generate. The AI will create comprehensive test cases based on your specifications.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    {customTests.length} characters
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCustomTests('')}
                      disabled={!customTests.trim()}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleRerunWithCustomTests}
                      disabled={!customTests.trim() || selectedPaths.length === 0}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Tips for Custom Test Specifications
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Be specific about user flows and edge cases</li>
                      <li>Include both positive and negative test scenarios</li>
                      <li>Mention specific data inputs and expected outputs</li>
                      <li>Consider accessibility and performance requirements</li>
                      <li>Specify any browser or device-specific tests needed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
