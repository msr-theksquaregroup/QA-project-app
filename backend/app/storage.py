"""
File storage and management utilities.
"""

import os
import shutil
import zipfile
import aiofiles
import requests
from typing import Optional, Dict, Any
from pathlib import Path
from urllib.parse import urlparse

from .models import FileNode, UploadedSource, generate_upload_id


class StorageManager:
    """Manages file uploads, storage, and retrieval."""
    
    def __init__(self, uploads_dir: str = "uploads", runs_dir: str = "runs"):
        self.uploads_dir = Path(uploads_dir)
        self.runs_dir = Path(runs_dir)
        
        # Create directories if they don't exist
        self.uploads_dir.mkdir(exist_ok=True)
        self.runs_dir.mkdir(exist_ok=True)
    
    async def upload_zip_file(self, file_content: bytes, filename: str) -> UploadedSource:
        """
        Upload and extract a ZIP file.
        
        Args:
            file_content: The ZIP file content as bytes
            filename: Original filename
            
        Returns:
            UploadedSource with upload ID and file tree
        """
        upload_id = generate_upload_id()
        upload_path = self.uploads_dir / upload_id
        upload_path.mkdir(exist_ok=True)
        
        # Save the ZIP file temporarily
        zip_path = upload_path / filename
        async with aiofiles.open(zip_path, 'wb') as f:
            await f.write(file_content)
        
        try:
            # Extract the ZIP file
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(upload_path)
            
            # Remove the ZIP file after extraction
            zip_path.unlink()
            
            # Build the file tree
            root_node = self.build_tree(upload_path, upload_id)
            
            return UploadedSource(uploadId=upload_id, root=root_node)
            
        except zipfile.BadZipFile:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise ValueError("Invalid ZIP file")
        except Exception as e:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise Exception(f"Failed to extract ZIP file: {str(e)}")
    
    async def upload_from_url(self, url: str) -> UploadedSource:
        """
        Download and extract files from a URL.
        
        Args:
            url: URL to download from (e.g., GitHub archive)
            
        Returns:
            UploadedSource with upload ID and file tree
        """
        upload_id = generate_upload_id()
        upload_path = self.uploads_dir / upload_id
        upload_path.mkdir(exist_ok=True)
        
        try:
            # Download the file
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            # Determine filename from URL or Content-Disposition header
            filename = self._get_filename_from_response(response, url)
            
            # Save the downloaded file
            file_path = upload_path / filename
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # If it's a ZIP file, extract it
            if filename.lower().endswith('.zip'):
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(upload_path)
                # Remove the ZIP file after extraction
                file_path.unlink()
            
            # Build the file tree
            root_node = self.build_tree(upload_path, upload_id)
            
            return UploadedSource(uploadId=upload_id, root=root_node)
            
        except requests.RequestException as e:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise Exception(f"Failed to download from URL: {str(e)}")
        except Exception as e:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise Exception(f"Failed to process downloaded file: {str(e)}")
    
    def _get_filename_from_response(self, response: requests.Response, url: str) -> str:
        """Extract filename from response headers or URL."""
        # Try to get filename from Content-Disposition header
        content_disposition = response.headers.get('Content-Disposition', '')
        if 'filename=' in content_disposition:
            filename = content_disposition.split('filename=')[1].strip('"\'')
            return filename
        
        # Fallback to URL path
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        
        # If no extension and looks like a GitHub archive, add .zip
        if not filename or '.' not in filename:
            if 'github.com' in url and 'archive' in url:
                filename = 'archive.zip'
            else:
                filename = 'download.zip'
        
        return filename
    

    
    async def get_file_content(self, file_path: str) -> str:
        """
        Get the content of a file.
        
        Args:
            file_path: Path to the file (format: upload_id/relative/path)
            
        Returns:
            File content as string
        """
        # Validate and construct the full path
        if '/' not in file_path:
            raise ValueError("Invalid file path format")
        
        full_path = self.uploads_dir / file_path
        
        # Security check: ensure path is within uploads directory
        try:
            full_path.resolve().relative_to(self.uploads_dir.resolve())
        except ValueError:
            raise ValueError("Invalid file path - outside uploads directory")
        
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if not full_path.is_file():
            raise ValueError(f"Path is not a file: {file_path}")
        
        try:
            async with aiofiles.open(full_path, 'r', encoding='utf-8') as f:
                return await f.read()
        except UnicodeDecodeError:
            # Try with different encoding for binary files
            async with aiofiles.open(full_path, 'r', encoding='latin-1') as f:
                content = await f.read()
                return content[:1000] + "...\n[Binary file truncated]" if len(content) > 1000 else content
    
    def get_upload_path(self, upload_id: str) -> Path:
        """Get the path to an upload directory."""
        return self.uploads_dir / upload_id
    
    def get_run_path(self, run_id: str) -> Path:
        """Get the path to a run directory."""
        return self.runs_dir / run_id
    
    def create_run_directory(self, run_id: str) -> Path:
        """Create and return the path to a run directory."""
        run_path = self.runs_dir / run_id
        run_path.mkdir(exist_ok=True)
        return run_path
    
    def cleanup_upload(self, upload_id: str) -> bool:
        """
        Clean up an upload directory.
        
        Args:
            upload_id: The upload ID to clean up
            
        Returns:
            True if cleanup was successful
        """
        upload_path = self.uploads_dir / upload_id
        if upload_path.exists():
            try:
                shutil.rmtree(upload_path)
                return True
            except Exception:
                return False
        return True
    
    def cleanup_run(self, run_id: str) -> bool:
        """
        Clean up a run directory.
        
        Args:
            run_id: The run ID to clean up
            
        Returns:
            True if cleanup was successful
        """
        run_path = self.runs_dir / run_id
        if run_path.exists():
            try:
                shutil.rmtree(run_path)
                return True
            except Exception:
                return False
        return True

    # New API functions with exact signatures requested
    
    async def save_zip(self, file_content: bytes, filename: str = "upload.zip") -> tuple[str, FileNode]:
        """
        Save ZIP file and return uploadId + FileNode.
        
        Args:
            file_content: ZIP file content as bytes
            filename: Optional filename (defaults to upload.zip)
            
        Returns:
            Tuple of (uploadId, FileNode)
        """
        upload_id = generate_upload_id()
        upload_path = self.uploads_dir / upload_id
        upload_path.mkdir(exist_ok=True)
        
        # Save the ZIP file temporarily
        zip_path = upload_path / filename
        async with aiofiles.open(zip_path, 'wb') as f:
            await f.write(file_content)
        
        try:
            # Extract the ZIP file
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(upload_path)
            
            # Remove the ZIP file after extraction
            zip_path.unlink()
            
            # Build the file tree
            root_node = self.build_tree(upload_path, upload_id)
            
            return upload_id, root_node
            
        except zipfile.BadZipFile:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise ValueError("Invalid ZIP file")
        except Exception as e:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise Exception(f"Failed to extract ZIP file: {str(e)}")
    
    async def save_url(self, url: str) -> tuple[str, FileNode]:
        """
        Download from URL and return uploadId + FileNode.
        
        Args:
            url: URL to download from (e.g., GitHub archive)
            
        Returns:
            Tuple of (uploadId, FileNode)
        """
        upload_id = generate_upload_id()
        upload_path = self.uploads_dir / upload_id
        upload_path.mkdir(exist_ok=True)
        
        try:
            # Download the file
            response = requests.get(url, stream=True, timeout=30)
            response.raise_for_status()
            
            # Determine filename from URL or Content-Disposition header
            filename = self._get_filename_from_response(response, url)
            
            # Save the downloaded file
            file_path = upload_path / filename
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # If it's a ZIP file, extract it
            if filename.lower().endswith('.zip'):
                with zipfile.ZipFile(file_path, 'r') as zip_ref:
                    zip_ref.extractall(upload_path)
                # Remove the ZIP file after extraction
                file_path.unlink()
            
            # Build the file tree
            root_node = self.build_tree(upload_path, upload_id)
            
            return upload_id, root_node
            
        except requests.RequestException as e:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise Exception(f"Failed to download from URL: {str(e)}")
        except Exception as e:
            # Clean up on error
            shutil.rmtree(upload_path, ignore_errors=True)
            raise Exception(f"Failed to process downloaded file: {str(e)}")
    
    def build_tree(self, base_path: Path, upload_id: str = None) -> FileNode:
        """
        Build FileNode tree from a directory path.
        
        Args:
            base_path: Path to the directory to build tree from
            upload_id: Optional upload ID for path prefixes (if None, uses relative paths)
            
        Returns:
            FileNode representing the directory tree
        """
        def build_node(path: Path, relative_to: Path) -> FileNode:
            relative_path = str(path.relative_to(relative_to))
            
            # Set the path prefix based on upload_id
            if upload_id:
                full_path = f"{upload_id}/{relative_path}"
            else:
                full_path = relative_path
            
            if path.is_file():
                return FileNode(
                    name=path.name,
                    path=full_path,
                    isDir=False
                )
            else:
                children = []
                try:
                    for child_path in sorted(path.iterdir()):
                        # Skip hidden files and common non-source directories
                        if child_path.name.startswith('.'):
                            continue
                        if child_path.name in ['node_modules', '__pycache__', '.git', 'dist', 'build']:
                            continue
                        
                        children.append(build_node(child_path, relative_to))
                except PermissionError:
                    # Skip directories we can't read
                    pass
                
                return FileNode(
                    name=path.name,
                    path=full_path,
                    isDir=True,
                    children=children if children else None
                )
        
        # Handle the case where base_path is the actual directory to scan
        if not base_path.exists():
            raise FileNotFoundError(f"Path does not exist: {base_path}")
        
        if base_path.is_file():
            # If it's a single file, create a simple node
            return FileNode(
                name=base_path.name,
                path=upload_id or base_path.name,
                isDir=False
            )
        
        # Find the actual root (handle single directory extraction)
        root_items = list(base_path.iterdir())
        if len(root_items) == 1 and root_items[0].is_dir():
            # If there's only one directory, use it as root
            actual_root = root_items[0]
            return build_node(actual_root, base_path)
        else:
            # Multiple items at root level or use the base directory itself
            return FileNode(
                name=upload_id or base_path.name,
                path=upload_id or str(base_path),
                isDir=True,
                children=[build_node(item, base_path) for item in root_items 
                         if not item.name.startswith('.')]
            )
    
    async def read_file(self, file_path: str) -> str:
        """
        Read file content from uploads directory.
        
        Args:
            file_path: Path to the file (format: upload_id/relative/path or absolute path)
            
        Returns:
            File content as string
        """
        # Handle both absolute paths and upload_id/relative paths
        if file_path.startswith('/'):
            # Absolute path
            full_path = Path(file_path)
        else:
            # Relative path from uploads directory
            full_path = self.uploads_dir / file_path
        
        # Security check: if it's under uploads dir, ensure path is within uploads directory
        if str(full_path).startswith(str(self.uploads_dir)):
            try:
                full_path.resolve().relative_to(self.uploads_dir.resolve())
            except ValueError:
                raise ValueError("Invalid file path - outside uploads directory")
        
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        if not full_path.is_file():
            raise ValueError(f"Path is not a file: {file_path}")
        
        try:
            async with aiofiles.open(full_path, 'r', encoding='utf-8') as f:
                return await f.read()
        except UnicodeDecodeError:
            # Try with different encoding for binary files
            try:
                async with aiofiles.open(full_path, 'r', encoding='latin-1') as f:
                    content = await f.read()
                    return content[:1000] + "...\n[Binary file truncated]" if len(content) > 1000 else content
            except Exception:
                return "[Binary file - cannot display content]"


# Global storage manager instance
storage_manager = StorageManager()
