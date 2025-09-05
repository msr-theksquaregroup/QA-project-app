import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { startAgentAnalysis, connectToAgentWebSocket, getAgentRunStatus } from '@/lib/api';
import { ArrowLeft, Play, CheckCircle, Clock, AlertCircle, Bot, FileCode, TestTube, Target, Zap, BarChart, FileCheck, RefreshCw, Download } from 'lucide-react';

interface AgentExecutionProps {
  code: string;
  filename: string;
  onBack: () => void;
}

interface AgentStatus {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message?: string;
  result?: any;
  icon: React.ComponentType<any>;
  color: string;
}

const AgentExecution: React.FC<AgentExecutionProps> = ({ code, filename, onBack }) => {
  const [runId, setRunId] = useState<string>('');
  const [agents, setAgents] = useState<AgentStatus[]>([
    { id: 'code_analysis', name: 'Code Analysis', status: 'pending', icon: FileCode, color: 'bg-blue-500' },
    { id: 'user_story', name: 'User Story', status: 'pending', icon: FileCheck, color: 'bg-green-500' },
    { id: 'gherkin', name: 'Gherkin Generation', status: 'pending', icon: TestTube, color: 'bg-purple-500' },
    { id: 'test_plan', name: 'Test Plan', status: 'pending', icon: Target, color: 'bg-orange-500' },
    { id: 'playwright', name: 'Playwright Generation', status: 'pending', icon: Bot, color: 'bg-indigo-500' },
    { id: 'execution', name: 'Test Execution', status: 'pending', icon: Play, color: 'bg-red-500' },
    { id: 'coverage', name: 'Coverage Analysis', status: 'pending', icon: BarChart, color: 'bg-yellow-500' },
    { id: 'final_report', name: 'Final Report', status: 'pending', icon: FileCheck, color: 'bg-teal-500' },
  ]);
  const [messages, setMessages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>({});
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [finalReportData, setFinalReportData] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkAllAgentsComplete();
  }, [agents, isRunning, runId]);

  const updateAgentStatus = (agentId: string, status: AgentStatus['status'], message?: string, result?: any) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: status === 'success' ? 'completed' : status, message, result }
        : agent
    ));
  };

  // Check if all agents are completed and trigger final report
  const checkAllAgentsComplete = () => {
    const completedCount = agents.filter(agent => agent.status === 'completed').length;
    if (completedCount === agents.length && !isRunning && runId) {
      setTimeout(() => {
        fetchResultsAndShowReport();
      }, 2000);
    }
  };

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const startAnalysis = async () => {
    try {
      setIsRunning(true);
      addMessage('🚀 Starting AI Agent Analysis...');
      
      const response = await startAgentAnalysis({
        code,
        filename,
        subfolder_path: 'analysis'
      });

      setRunId(response.run_id);
      addMessage(`✅ Analysis started with ID: ${response.run_id}`);

      // Connect to WebSocket for real-time updates
      const ws = connectToAgentWebSocket(
        response.run_id,
        (data) => {
          console.log('WebSocket message:', data);
          
          if (data.type === 'agent_status') {
            updateAgentStatus(data.agent_id, data.status, data.message);
            addMessage(`🤖 ${data.agent_name}: ${data.message || data.status}`);
            
            // If this agent completed, mark it as successful
            if (data.status === 'success' || data.status === 'completed') {
              updateAgentStatus(data.agent_id, 'completed', `✅ ${data.agent_name} completed successfully!`);
            }
          } else if (data.type === 'agent_result') {
            setResults(prev => ({ ...prev, [data.agent_id]: data.result }));
            addMessage(`📊 ${data.agent_name} completed with results`);
          } else if (data.type === 'workflow_complete') {
            addMessage('🎉 All agents completed successfully!');
            setIsRunning(false);
            
            // Mark all agents as completed
            setAgents(prev => prev.map(agent => ({ ...agent, status: 'completed' })));
            
            // Auto-fetch results and show final report
            setTimeout(() => {
              fetchResultsAndShowReport();
            }, 1000);
          } else if (data.type === 'error') {
            addMessage(`❌ Error: ${data.message}`);
            setIsRunning(false);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          addMessage('❌ Connection error occurred');
          setIsRunning(false);
        },
        (event) => {
          console.log('WebSocket closed:', event);
          addMessage('🔌 Connection closed');
          setIsRunning(false);
        }
      );

      wsRef.current = ws;

    } catch (error) {
      console.error('Failed to start analysis:', error);
      addMessage(`❌ Failed to start analysis: ${error}`);
      setIsRunning(false);
    }
  };

  const fetchResults = async () => {
    if (!runId) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/run/${runId}`);
      const data = await response.json();
      
      if (data.error) {
        addMessage(`❌ Error fetching results: ${data.error}`);
        return;
      }
      
      // Update results with the fetched data
      const newResults: any = {};
      if (data.gherkin) newResults.gherkin = data.gherkin;
      if (data.test_plan) newResults.test_plan = data.test_plan;
      if (data.playwright_test) newResults.playwright_test = data.playwright_test;
      if (data.execution_log) newResults.execution_log = data.execution_log;
      if (data.final_report) newResults.final_report = data.final_report;
      if (data.coverage_report) newResults.coverage_report = data.coverage_report;
      
      setResults(newResults);
      addMessage(`📊 Results updated: ${Object.keys(newResults).length} artifacts loaded`);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      addMessage(`❌ Failed to fetch results: ${error}`);
    }
  };

  const fetchResultsAndShowReport = async () => {
    if (!runId) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/run/${runId}`);
      const data = await response.json();
      
      if (data.error) {
        addMessage(`❌ Error fetching results: ${data.error}`);
        return;
      }
      
      // Update results with the fetched data
      const newResults: any = {};
      if (data.gherkin) newResults.gherkin = data.gherkin;
      if (data.test_plan) newResults.test_plan = data.test_plan;
      if (data.playwright_test) newResults.playwright_test = data.playwright_test;
      if (data.execution_log) newResults.execution_log = data.execution_log;
      if (data.final_report) newResults.final_report = data.final_report;
      if (data.coverage_report) newResults.coverage_report = data.coverage_report;
      
      setResults(newResults);
      setFinalReportData(data.final_report);
      addMessage(`📊 Results loaded successfully! Opening final report...`);
      
      // Show final report popup
      setShowFinalReport(true);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      addMessage(`❌ Failed to fetch results: ${error}`);
    }
  };

  const downloadArtifact = async (artifactType: string) => {
    if (!runId) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/download/${runId}/${artifactType}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${artifactType}_${runId}.${artifactType === 'playwright_test' ? 'js' : artifactType === 'gherkin' ? 'feature' : artifactType.includes('report') ? 'json' : 'md'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addMessage(`📥 Downloaded ${artifactType} artifact`);
    } catch (error) {
      console.error('Download failed:', error);
      addMessage(`❌ Download failed: ${error}`);
    }
  };

  const downloadAllArtifacts = async () => {
    if (!runId) return;
    
    try {
      const response = await fetch(`http://localhost:8001/api/download-all/${runId}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `artifacts_${runId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      addMessage(`📥 Downloaded all artifacts as ZIP file`);
    } catch (error) {
      console.error('Download failed:', error);
      addMessage(`❌ Download failed: ${error}`);
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onBack} 
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Files</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Agent Analysis
              </h1>
              <p className="text-gray-600 mt-1">
                Processing: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{filename}</span>
              </p>
            </div>
          </div>
          
          {!isRunning && !runId && (
            <Button 
              onClick={startAnalysis}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          )}
          
          {isRunning && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </Badge>
          )}
          
          {!isRunning && runId && (
            <div className="flex items-center space-x-3">
              <Button 
                onClick={fetchResults}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Fetch Results</span>
              </Button>
              
              {Object.keys(results).length > 0 && (
                <>
                  <Button 
                    onClick={() => setShowFinalReport(true)}
                    variant="outline"
                    className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>View Report</span>
                  </Button>
                  <Button 
                    onClick={downloadAllArtifacts}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-blue-500" />
                Agent Workflow Progress
              </h2>
              
              <div className="space-y-4">
                {agents.map((agent, index) => {
                  const IconComponent = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className={`flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                        agent.status === 'running' 
                          ? 'border-blue-200 bg-blue-50 shadow-md' 
                          : agent.status === 'completed'
                          ? 'border-green-200 bg-green-50'
                          : agent.status === 'error'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${agent.color} flex items-center justify-center mr-4`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{agent.name}</h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(agent.status)}
                            <Badge variant="outline" className={getStatusColor(agent.status)}>
                              {agent.status}
                            </Badge>
                          </div>
                        </div>
                        {agent.message && (
                          <p className="text-sm text-gray-600 mt-1">{agent.message}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Messages & Results */}
          <div className="space-y-6">
            {/* Live Messages */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-green-500" />
                Live Messages
              </h3>
              <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4 font-mono text-sm">
                {messages.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No messages yet. Start analysis to see live updates.
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div key={index} className="mb-2 text-gray-700">
                      {message}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileCode className="w-5 h-5 mr-2 text-purple-500" />
                Code Preview
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {code}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {Object.keys(results).length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-teal-500" />
                Analysis Results
              </h2>
              
              <Tabs defaultValue={Object.keys(results)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                  {Object.keys(results).map((agentId) => (
                    <TabsTrigger key={agentId} value={agentId} className="text-xs">
                      {agents.find(a => a.id === agentId)?.name || agentId}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {Object.entries(results).map(([agentId, result]) => (
                  <TabsContent key={agentId} value={agentId} className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {agents.find(a => a.id === agentId)?.name || agentId} Results
                        </h3>
                        <Button
                          onClick={() => downloadArtifact(agentId)}
                          size="sm"
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </Button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                          {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}

        {/* Final Report Popup Modal */}
        {showFinalReport && finalReportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Analysis Complete! 🎉</h2>
                      <p className="text-green-100">All agents have successfully processed your code</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowFinalReport(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  {/* Success Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-sm text-green-700">Agents Completed</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{Object.keys(results).length}</div>
                      <div className="text-sm text-blue-700">Artifacts Generated</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">✓</div>
                      <div className="text-sm text-purple-700">Tests Created</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">✓</div>
                      <div className="text-sm text-orange-700">Ready to Download</div>
                    </div>
                  </div>

                  {/* Final Report Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <FileCheck className="w-5 h-5 mr-2 text-teal-500" />
                      Analysis Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>File:</strong> {filename}
                      </div>
                      <div>
                        <strong>Status:</strong> <span className="text-green-600 font-semibold">Complete</span>
                      </div>
                      <div>
                        <strong>Framework:</strong> {finalReportData.metadata?.framework_version || 'N/A'}
                      </div>
                      <div>
                        <strong>Generated:</strong> {finalReportData.metadata?.generated_at ? new Date(finalReportData.metadata.generated_at).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Generated Artifacts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Generated Artifacts:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.keys(results).map((artifactType) => (
                        <div key={artifactType} className="flex items-center justify-between bg-white border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="font-medium capitalize">{artifactType.replace('_', ' ')}</span>
                          </div>
                          <Button
                            onClick={() => downloadArtifact(artifactType)}
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                <div className="text-sm text-gray-600">
                  🎉 All artifacts are ready for download!
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowFinalReport(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={downloadAllArtifacts}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Artifacts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentExecution;