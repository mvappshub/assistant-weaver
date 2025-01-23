export interface Message {
  role: "user" | "assistant";
  content: string;
  agentName?: string;
}

export interface Assistant {
  id: string;
  name: string;
  role: string;
  model: string;
  systemPrompt?: string;
}

export interface AgentFlow {
  id: string;
  name: string;
  agents: string[]; // IDs asistentů v pořadí
}

export type ModelProvider = "gemini-pro" | "deepseek-chat";

export interface ApiKeys {
  "gemini-pro"?: string;
  "deepseek-chat"?: string;
}