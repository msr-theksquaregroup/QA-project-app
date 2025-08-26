import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  height?: string;
  showLineNumbers?: boolean;
}

export function CodePreview({
  code,
  language = 'typescript',
  filename,
  className,
  height = '400px',
  showLineNumbers = true,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      typescript: 'ts',
      javascript: 'js',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      html: 'html',
      css: 'css',
      json: 'json',
      xml: 'xml',
      yaml: 'yml',
      markdown: 'md',
      sql: 'sql',
      shell: 'sh',
      powershell: 'ps1',
    };
    return extensions[lang] || 'txt';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      {(filename || code) && (
        <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/20 px-4 py-2">
          <div className="flex items-center space-x-2">
            {filename && (
              <span className="text-sm font-medium text-foreground">
                {filename}
              </span>
            )}
            <span className="rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
              {language}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              <span className="ml-1 text-xs">
                {copied ? 'Copied!' : 'Copy'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-7 px-2"
            >
              <Download className="h-3 w-3" />
              <span className="ml-1 text-xs">Download</span>
            </Button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="overflow-hidden rounded-b-lg border border-border">
        <Editor
          height={height}
          language={language}
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: showLineNumbers ? 'on' : 'off',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            renderWhitespace: 'selection',
            folding: true,
            scrollbar: {
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-muted/20">
              <div className="text-sm text-muted-foreground">Loading editor...</div>
            </div>
          }
        />
      </div>
      
      {/* Footer with stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {code.split('\n').length} lines, {code.length} characters
        </span>
        <span>Read-only</span>
      </div>
    </div>
  );
}
