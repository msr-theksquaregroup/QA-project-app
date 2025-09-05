"""
QA Analysis Runner - Orchestrates the execution of QA analysis runs.
"""

import asyncio
import json
from typing import Dict, List, Optional, Any, AsyncGenerator
from datetime import datetime
from pathlib import Path
import queue
import threading

from .models import Run, AgentState, generate_run_id, Coverage, FileStatus, AGENTS
from .storage import storage_manager
from .notebook24_adapter import notebook_adapter


class RunManager:
    """Manages QA analysis runs and their lifecycle."""
    
    def __init__(self):
        self.active_runs: Dict[str, Run] = {}
        self.completed_runs: Dict[str, Run] = {}
        self.run_tasks: Dict[str, asyncio.Task] = {}
        # Event queues for real-time streaming
        self.event_queues: Dict[str, queue.Queue] = {}
    
    def start_run(self, run_id: str, paths: List[str], use_notebook: int = 24) -> str:
        """
        Start a new QA analysis run and spawn background task.
        
        Args:
            run_id: The run ID to use
            paths: List of file paths to analyze
            use_notebook: Notebook version to use (18 or 24)
            
        Returns:
            The run ID of the started run
        """
        # Create initial run object
        run = Run(
            runId=run_id,
            status="queued",
            agents=self._initialize_agents(),
            files=[],
            artifacts={},
            errors=[]
        )
        
        # Store the run
        self.active_runs[run_id] = run
        
        # Create event queue for this run
        self.event_queues[run_id] = queue.Queue()
        
        # Create run directory
        run_path = storage_manager.create_run_directory(run_id)
        
        # Start the analysis task in background thread (since run_agents is synchronous)
        def run_in_background():
            try:
                self._execute_run_sync(run_id, paths, use_notebook)
            except Exception as e:
                self._handle_run_failure_sync(run_id, str(e))
        
        thread = threading.Thread(target=run_in_background, daemon=True)
        thread.start()
        
        return run_id
    
    def _initialize_agents(self) -> List[AgentState]:
        """Initialize all agents in idle state."""
        return [
            AgentState(key=agent["key"], label=agent["label"], state="idle")
            for agent in AGENTS
        ]
    
    def _execute_run_sync(self, run_id: str, paths: List[str], use_notebook: int):
        """Execute a QA analysis run synchronously using run_agents."""
        try:
            # Update run status to running
            if run_id in self.active_runs:
                run = self.active_runs[run_id]
                run.status = "running"
                self._save_run_state_sync(run_id, run)
                
                # Add initial event to queue
                self._add_event_to_queue(run_id, {
                    "type": "status_update",
                    "data": {"status": "running", "message": "Starting QA analysis..."}
                })
            
            # Run the analysis using run_agents from notebook adapter
            for event in notebook_adapter.run_agents(paths, run_id, use_notebook=use_notebook):
                # Process the event and update run state
                self._process_agent_event(run_id, event)
                
                # Add event to queue for streaming
                self._add_event_to_queue(run_id, {
                    "type": "agent_update",
                    "data": event
                })
            
            # Mark run as completed and save final state
            if run_id in self.active_runs:
                run = self.active_runs[run_id]
                run.status = "completed"
                self._save_run_state_sync(run_id, run)
                self._save_final_run_json(run_id, run)
                
                # Add completion event
                self._add_event_to_queue(run_id, {
                    "type": "run_complete",
                    "data": {"status": "completed", "runId": run_id}
                })
            
        except Exception as e:
            # Handle run failure
            self._handle_run_failure_sync(run_id, str(e))
        finally:
            # Move run from active to completed and cleanup
            if run_id in self.active_runs:
                self.completed_runs[run_id] = self.active_runs.pop(run_id)
            
            # Close event queue
            if run_id in self.event_queues:
                self._add_event_to_queue(run_id, {"type": "stream_end", "data": {}})
    
    def _process_agent_event(self, run_id: str, event: Dict[str, Any]):
        """Process an event from run_agents and update run state."""
        if run_id not in self.active_runs:
            return
        
        run = self.active_runs[run_id]
        
        # Update agent state based on event
        if "agent" in event and "state" in event:
            agent_key = event["agent"]
            agent_state = event["state"]
            agent_message = event.get("message", "")
            
            # Find and update the corresponding agent
            for agent in run.agents:
                if agent.key == agent_key:
                    agent.state = agent_state
                    agent.message = agent_message
                    break
        
        # Update coverage if provided
        if "coverage" in event:
            coverage_data = event["coverage"]
            if isinstance(coverage_data, dict):
                run.coverage = Coverage(**coverage_data)
        
        # Update artifacts if provided
        if "artifact" in event:
            agent_key = event.get("agent", "unknown")
            run.artifacts[agent_key] = event["artifact"]
    
    def _add_event_to_queue(self, run_id: str, event: Dict[str, Any]):
        """Add an event to the run's event queue."""
        if run_id in self.event_queues:
            try:
                self.event_queues[run_id].put(event, timeout=1.0)
            except queue.Full:
                print(f"Event queue full for run {run_id}, dropping event")
    
    def _save_run_state_sync(self, run_id: str, run: Run):
        """Save run state synchronously."""
        try:
            run_path = storage_manager.get_run_path(run_id)
            run_path.mkdir(exist_ok=True)
            
            state_file = run_path / "state.json"
            run_dict = run.model_dump()
            
            with open(state_file, 'w') as f:
                json.dump(run_dict, f, indent=2)
        except Exception as e:
            print(f"Failed to save run state for {run_id}: {e}")
    
    def _save_final_run_json(self, run_id: str, run: Run):
        """Save final Run JSON to runs/{runId}/run.json."""
        try:
            run_path = storage_manager.get_run_path(run_id)
            run_path.mkdir(exist_ok=True)
            
            run_file = run_path / "run.json"
            run_dict = run.model_dump()
            
            with open(run_file, 'w') as f:
                json.dump(run_dict, f, indent=2)
                
            print(f"✅ Saved final run JSON: {run_file}")
        except Exception as e:
            print(f"Failed to save final run JSON for {run_id}: {e}")
    
    def _handle_run_failure_sync(self, run_id: str, error_message: str):
        """Handle run failure synchronously."""
        if run_id in self.active_runs:
            run = self.active_runs[run_id]
            run.status = "failed"
            run.errors.append(f"Run failed: {error_message}")
            self._save_run_state_sync(run_id, run)
            self._save_final_run_json(run_id, run)
            
            # Add error event to queue
            self._add_event_to_queue(run_id, {
                "type": "run_error",
                "data": {"status": "failed", "error": error_message}
            })
    
    async def event_stream(self, run_id: str) -> AsyncGenerator[str, None]:
        """
        Async generator that yields text/event-stream with JSON events for a run.
        
        Args:
            run_id: The run ID to stream events for
            
        Yields:
            Server-Sent Events formatted strings with JSON data
        """
        if run_id not in self.event_queues:
            # Run doesn't exist or has no event queue
            yield f"data: {json.dumps({'type': 'error', 'data': {'error': 'Run not found'}})}\n\n"
            return
        
        event_queue = self.event_queues[run_id]
        
        # Send initial connection event
        yield f"data: {json.dumps({'type': 'connected', 'data': {'runId': run_id}})}\n\n"
        
        while True:
            try:
                # Wait for events with timeout
                event = event_queue.get(timeout=1.0)
                
                # Check for stream end
                if event.get("type") == "stream_end":
                    yield f"data: {json.dumps({'type': 'stream_end', 'data': {}})}\n\n"
                    break
                
                # Yield the event as SSE format
                event_json = json.dumps(event)
                yield f"data: {event_json}\n\n"
                
                # Mark task as done
                event_queue.task_done()
                
            except queue.Empty:
                # Send heartbeat to keep connection alive
                yield f"data: {json.dumps({'type': 'heartbeat', 'data': {'timestamp': datetime.utcnow().isoformat()}})}\n\n"
                
                # Check if run is still active, if not break
                if (run_id not in self.active_runs and 
                    run_id not in self.run_tasks and 
                    event_queue.empty()):
                    break
                    
            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'data': {'error': str(e)}})}\n\n"
                break
        
        # Cleanup event queue when streaming ends
        if run_id in self.event_queues:
            try:
                # Clear any remaining events
                while not event_queue.empty():
                    event_queue.get_nowait()
                    event_queue.task_done()
            except queue.Empty:
                pass
            finally:
                del self.event_queues[run_id]
    
    # Legacy methods kept for compatibility with existing get_run functionality
    
    async def _save_run_state(self, run_id: str, run: Run):
        """Save the current run state to disk."""
        try:
            run_path = storage_manager.get_run_path(run_id)
            run_path.mkdir(exist_ok=True)
            
            state_file = run_path / "state.json"
            
            # Convert run to dict for serialization
            run_dict = run.model_dump()
            
            with open(state_file, 'w') as f:
                json.dump(run_dict, f, indent=2)
                
        except Exception as e:
            print(f"Failed to save run state for {run_id}: {e}")
    
    async def _load_run_state(self, run_id: str) -> Optional[Run]:
        """Load a run state from disk."""
        try:
            run_path = storage_manager.get_run_path(run_id)
            state_file = run_path / "state.json"
            
            if not state_file.exists():
                return None
            
            with open(state_file, 'r') as f:
                run_dict = json.load(f)
            
            # No datetime conversion needed since we removed created_at
            
            return Run(**run_dict)
            
        except Exception as e:
            print(f"Failed to load run state for {run_id}: {e}")
            return None
    
    async def get_run(self, run_id: str) -> Optional[Run]:
        """Get a run by ID."""
        # Check active runs first
        if run_id in self.active_runs:
            return self.active_runs[run_id]
        
        # Check completed runs
        if run_id in self.completed_runs:
            return self.completed_runs[run_id]
        
        # Try to load from disk
        run = await self._load_run_state(run_id)
        if run:
            # Cache in completed runs
            self.completed_runs[run_id] = run
            return run
        
        return None
    
    async def list_runs(self) -> List[Run]:
        """List all runs (active and completed)."""
        all_runs = []
        
        # Add active runs
        all_runs.extend(self.active_runs.values())
        
        # Add completed runs
        all_runs.extend(self.completed_runs.values())
        
        # Try to load any runs from disk that aren't in memory
        try:
            runs_dir = storage_manager.runs_dir
            if runs_dir.exists():
                for run_dir in runs_dir.iterdir():
                    if run_dir.is_dir():
                        run_id = run_dir.name
                        if (run_id not in self.active_runs and 
                            run_id not in self.completed_runs):
                            run = await self._load_run_state(run_id)
                            if run:
                                self.completed_runs[run_id] = run
                                all_runs.append(run)
        except Exception as e:
            print(f"Error loading runs from disk: {e}")
        
        # Sort by run ID (which contains timestamp)
        all_runs.sort(key=lambda r: r.runId, reverse=True)
        
        return all_runs
    
    async def cancel_run(self, run_id: str) -> bool:
        """Cancel a running analysis."""
        if run_id in self.run_tasks:
            task = self.run_tasks[run_id]
            task.cancel()
            
            # Update run status
            if run_id in self.active_runs:
                run = self.active_runs[run_id]
                run.status = "failed"
                run.errors.append("Run cancelled by user")
                await self._save_run_state(run_id, run)
            
            return True
        
        return False
    
    def get_run_status(self, run_id: str) -> Optional[str]:
        """Get the current status of a run."""
        if run_id in self.active_runs:
            return self.active_runs[run_id].status
        
        if run_id in self.completed_runs:
            return self.completed_runs[run_id].status
        
        return None
    
    def is_run_active(self, run_id: str) -> bool:
        """Check if a run is currently active."""
        return run_id in self.active_runs and run_id in self.run_tasks


# Global run manager instance
run_manager = RunManager()
