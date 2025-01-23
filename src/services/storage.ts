import { Message, Assistant, AgentFlow, ApiKeys } from "@/types";
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

export function saveApiKeys(keys: ApiKeys): void {
  try {
    const sanitizedKeys: ApiKeys = {};
    for (const [key, value] of Object.entries(keys)) {
      if (value && typeof value === 'string') {
        sanitizedKeys[key as keyof ApiKeys] = value.trim();
      }
    }
    localStorage.setItem(STORAGE_KEYS.API_KEY, JSON.stringify(sanitizedKeys));
  } catch (error) {
    console.error("Error saving API keys:", error);
  }
}

export function loadApiKeys(): ApiKeys {
  try {
    const keys = localStorage.getItem(STORAGE_KEYS.API_KEY);
    return keys ? JSON.parse(keys) : {};
  } catch (error) {
    console.error("Error loading API keys:", error);
    return {};
  }
}