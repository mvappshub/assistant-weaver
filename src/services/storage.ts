import { Message, Assistant, AgentFlow } from "@/types";
import { STORAGE_KEYS } from "@/lib/storage";

export function saveMessages(messages: Message[]): void {
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

export function loadMessages(): Message[] {
  const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return messages ? JSON.parse(messages) : [];
}

export function saveAssistants(assistants: Assistant[]): void {
  localStorage.setItem(STORAGE_KEYS.ASSISTANTS, JSON.stringify(assistants));
}

export function loadAssistants(): Assistant[] {
  const assistants = localStorage.getItem(STORAGE_KEYS.ASSISTANTS);
  return assistants ? JSON.parse(assistants) : [];
}

export function saveAgentFlows(flows: AgentFlow[]): void {
  localStorage.setItem("agentFlows", JSON.stringify(flows));
}

export function loadAgentFlows(): AgentFlow[] {
  const flows = localStorage.getItem("agentFlows");
  return flows ? JSON.parse(flows) : [];
}

export function saveApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

export function loadApiKey(): string {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
}