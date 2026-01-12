
export enum AgentMode {
  WEB = 'WEB',
  LOCAL = 'LOCAL',
  HYBRID = 'HYBRID',
  EXTENSIONS = 'EXTENSIONS'
}

export enum StepStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  WAITING_APPROVAL = 'WAITING_APPROVAL'
}

export interface PlanStep {
  id: string;
  description: string;
  tool: 'BROWSER_CLICK' | 'BROWSER_TYPE' | 'BROWSER_NAVIGATE' | 'FILE_READ' | 'FILE_WRITE' | 'ANALYSIS' | 'WEBHOOK_TRIGGER' | 'BROWSER_INSTALL_EXTENSION';
  params: Record<string, any>;
  status: StepStatus;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence?: string; // Screenshot URL or log snippet
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  lastModified?: string;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  agent: 'ORCHESTRATOR' | 'ANALYST' | 'WEB_OP' | 'FILE_OP' | 'GUARD' | 'AUTOMATION';
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  installed: boolean;
}
