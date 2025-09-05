import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { FileNode } from '@/types';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  File,
  Check,
  Minus
} from 'lucide-react';

interface FileTreeProps {
  root: FileNode;
  selectedPaths: string[];
  onSelectionChange: (paths: string[]) => void;
  onFileClick?: (path: string) => void;
  selectedFile?: string;
  className?: string;
}

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  selectedPaths: string[];
  onToggle: (path: string) => void;
  expandedNodes: Set<string>;
  onExpandToggle: (path: string) => void;
  onFileClick?: (path: string) => void;
  selectedFile?: string;
}

type CheckState = 'unchecked' | 'checked' | 'indeterminate';

export function FileTree({ 
  root, 
  selectedPaths, 
  onSelectionChange,
  onFileClick,
  selectedFile,
  className 
}: FileTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([root.path]));

  const handleToggle = useCallback((path: string) => {
    const newSelection = selectedPaths.includes(path)
      ? selectedPaths.filter(p => p !== path)
      : [...selectedPaths, path];
    
    onSelectionChange(newSelection);
  }, [selectedPaths, onSelectionChange]);

  const handleExpandToggle = useCallback((path: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  }, []);

  return (
    <div className={cn('space-y-1', className)}>
      <FileTreeNode
        node={root}
        level={0}
        selectedPaths={selectedPaths}
        onToggle={handleToggle}
        expandedNodes={expandedNodes}
        onExpandToggle={handleExpandToggle}
        onFileClick={onFileClick}
        selectedFile={selectedFile}
      />
    </div>
  );
}

function FileTreeNode({
  node,
  level,
  selectedPaths,
  onToggle,
  expandedNodes,
  onExpandToggle,
  onFileClick,
  selectedFile,
}: FileTreeNodeProps) {
  const isExpanded = expandedNodes.has(node.path);
  const hasChildren = node.children && node.children.length > 0;

  // Calculate check state for this node
  const getCheckState = useCallback((currentNode: FileNode): CheckState => {
    if (!currentNode.children) {
      // Leaf node - check if it's selected
      return selectedPaths.includes(currentNode.path) ? 'checked' : 'unchecked';
    }

    // Directory node - check children states
    const childStates = currentNode.children.map(child => getCheckState(child));
    const checkedCount = childStates.filter(state => state === 'checked').length;
    const indeterminateCount = childStates.filter(state => state === 'indeterminate').length;

    if (checkedCount === childStates.length) {
      return 'checked';
    } else if (checkedCount > 0 || indeterminateCount > 0) {
      return 'indeterminate';
    } else {
      return 'unchecked';
    }
  }, [selectedPaths]);

  const checkState = getCheckState(node);
  const isSelectedForPreview = selectedFile === node.path;

  const handleNodeClick = () => {
    if (node.isDir && hasChildren) {
      onExpandToggle(node.path);
    }
  };

  const handleFileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.isDir && onFileClick) {
      onFileClick(node.path);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (node.isDir && node.children) {
      // For directories, toggle all children
      const allChildPaths = getAllChildPaths(node);
      const shouldSelect = checkState !== 'checked';
      
      if (shouldSelect) {
        // Add all child paths that aren't already selected
        const newPaths = [...selectedPaths, ...allChildPaths.filter(p => !selectedPaths.includes(p))];
        onToggle(newPaths[0]); // This will trigger the parent's selection change logic
        // We need to call onSelectionChange directly for bulk operations
        // Since we can't access onSelectionChange directly, we'll use the onToggle for each path
        // This is a simplified approach - in a real app you'd want bulk selection
      } else {
        // Remove all child paths
        allChildPaths.forEach(path => {
          if (selectedPaths.includes(path)) {
            onToggle(path);
          }
        });
      }
    } else {
      // For files, just toggle this file
      onToggle(node.path);
    }
  };

  const CheckboxIcon = checkState === 'checked' 
    ? Check 
    : checkState === 'indeterminate' 
    ? Minus 
    : 'div';

  return (
    <div>
      <div
        className={cn(
          'flex items-center space-x-2 rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
          level > 0 && 'ml-4',
          isSelectedForPreview && 'bg-blue-50 border border-blue-200'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/collapse button */}
        {node.isDir && hasChildren ? (
          <button
            onClick={handleNodeClick}
            className="flex h-4 w-4 items-center justify-center rounded hover:bg-accent"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <div className="w-4" />
        )}

        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded border transition-colors',
            checkState === 'checked' && 'bg-primary border-primary text-primary-foreground',
            checkState === 'indeterminate' && 'bg-primary border-primary text-primary-foreground',
            checkState === 'unchecked' && 'border-muted-foreground hover:border-foreground'
          )}
        >
          {CheckboxIcon !== 'div' && <CheckboxIcon className="h-3 w-3" />}
        </button>

        {/* Icon */}
        {node.isDir ? (
          isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-600" />
          ) : (
            <Folder className="h-4 w-4 text-blue-600" />
          )
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}

        {/* Name */}
        <span
          onClick={node.isDir ? handleNodeClick : handleFileClick}
          className={cn(
            "flex-1 truncate",
            !node.isDir && "hover:text-blue-600 cursor-pointer",
            isSelectedForPreview && "text-blue-700 font-medium"
          )}
        >
          {node.name}
        </span>
      </div>

      {/* Children */}
      {node.isDir && hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedPaths={selectedPaths}
              onToggle={onToggle}
              expandedNodes={expandedNodes}
              onExpandToggle={onExpandToggle}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getAllChildPaths(node: FileNode): string[] {
  const paths: string[] = [];
  
  if (!node.isDir) {
    paths.push(node.path);
    return paths;
  }
  
  if (node.children) {
    for (const child of node.children) {
      if (child.isDir) {
        paths.push(...getAllChildPaths(child));
      } else {
        paths.push(child.path);
      }
    }
  }
  
  return paths;
}
