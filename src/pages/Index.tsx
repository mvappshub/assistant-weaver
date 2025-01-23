import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelect } from "@/components/ModelSelect";
import { AssistantManager } from "@/components/AssistantManager";
import { AgentFlowManager } from "@/components/AgentFlowManager";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Message, Assistant, AgentFlow, ModelProvider, ApiKeys } from "@/types";
import { generateResponse } from "@/services/ai";
import {
  saveMessages,
  loadMessages,
  loadApiKeys,
  saveApiKeys,
  loadAssistants,
  saveAssistants,
  loadAgentFlows,
  saveAgentFlows,
} from "@/services/storage";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>("gemini-pro");
  const [apiKeys, setApiKeys] = useState<ApiKeys>(loadApiKeys());
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [flows, setFlows] = useState<AgentFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<AgentFlow | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(loadMessages());
    setAssistants(loadAssistants());
    setFlows(loadAgentFlows());
  }, []);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (Object.keys(apiKeys).length > 0) {
      saveApiKeys(apiKeys);
    }
  }, [apiKeys]);

  useEffect(() => {
    if (assistants.length > 0) {
      saveAssistants(assistants);
    }
  }, [assistants]);

  useEffect(() => {
    if (flows.length > 0) {
      saveAgentFlows(flows);
    }
  }, [flows]);

  const processAgentFlow = async (message: string, flow: AgentFlow) => {
    let currentMessage = message;
    
    for (const agentId of flow.agents) {
      const agent = assistants.find(a => a.id === agentId);
      if (!agent) continue;

      const newMessage: Message = {
        role: "user",
        content: currentMessage,
        agentName: agent.name
      };
      setMessages(prev => [...prev, newMessage]);

      try {
        const response = await generateResponse(
          currentMessage,
          agent.model,
          apiKeys[agent.model as ModelProvider] || "",
          agent.systemPrompt
        );

        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          agentName: agent.name
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        currentMessage = response;
      } catch (error) {
        toast({
          title: "Chyba při komunikaci",
          description: `Nepodařilo se získat odpověď od agenta ${agent.name}.`,
          variant: "destructive",
        });
        console.error("Error generating response:", error);
        break;
      }
    }
  };

  const handleSend = async (message: string) => {
    if (selectedFlow) {
      setIsProcessing(true);
      await processAgentFlow(message, selectedFlow);
      setIsProcessing(false);
      return;
    }

    const currentApiKey = apiKeys[selectedModel];
    
    if (!currentApiKey) {
      toast({
        title: "API klíč není nastaven",
        description: `Prosím nastavte API klíč pro model ${selectedModel}.`,
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = { 
      role: "user", 
      content: message,
      agentName: selectedAssistant?.name
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      let systemPrompt = "";
      if (selectedAssistant) {
        systemPrompt = selectedAssistant.systemPrompt || "";
      }

      const response = await generateResponse(
        message, 
        selectedModel, 
        currentApiKey,
        systemPrompt
      );
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        agentName: selectedAssistant?.name || selectedModel,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Chyba při komunikaci",
        description: "Nepodařilo se získat odpověď od AI modelu.",
        variant: "destructive",
      });
      console.error("Error generating response:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [selectedModel]: value
    }));
  };

  const handleAssistantSelect = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    setSelectedModel(assistant.model as ModelProvider);
    setSelectedFlow(null);
  };

  const handleAssistantCreate = (assistant: Assistant) => {
    setAssistants(prev => [...prev, assistant]);
  };

  const handleAssistantUpdate = (updatedAssistant: Assistant) => {
    setAssistants(prev => 
      prev.map(a => a.id === updatedAssistant.id ? updatedAssistant : a)
    );
  };

  const handleAssistantDelete = (assistantId: string) => {
    setAssistants(prev => prev.filter(a => a.id !== assistantId));
    if (selectedAssistant?.id === assistantId) {
      setSelectedAssistant(null);
    }
  };

  const handleFlowCreate = (flow: AgentFlow) => {
    setFlows(prev => [...prev, flow]);
  };

  const handleFlowDelete = (flowId: string) => {
    setFlows(prev => prev.filter(f => f.id !== flowId));
    if (selectedFlow?.id === flowId) {
      setSelectedFlow(null);
    }
  };

  const handleFlowSelect = (flow: AgentFlow) => {
    setSelectedFlow(flow);
    setSelectedAssistant(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <ModelSelect value={selectedModel} onChange={(value: ModelProvider) => setSelectedModel(value)} />
            <Input
              type="password"
              placeholder={`API klíč pro ${selectedModel}`}
              value={apiKeys[selectedModel] || ""}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="w-64"
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container pt-20 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {(selectedAssistant || selectedFlow) && (
                <div className="bg-secondary/20 p-4 rounded-lg">
                  <p className="text-sm font-medium">
                    {selectedFlow 
                      ? `Aktivní flow: ${selectedFlow.name}`
                      : `Aktivní asistent: ${selectedAssistant?.name}`}
                  </p>
                </div>
              )}
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={index} {...message} />
                ))}
              </div>
              <ChatInput onSend={handleSend} disabled={isProcessing} />
            </div>
          </div>
          <div className="space-y-4">
            <AssistantManager
              assistants={assistants}
              onSelect={handleAssistantSelect}
              onCreate={handleAssistantCreate}
              onUpdate={handleAssistantUpdate}
              onDelete={handleAssistantDelete}
              selectedAssistant={selectedAssistant}
            />
            <AgentFlowManager
              assistants={assistants}
              flows={flows}
              onCreateFlow={handleFlowCreate}
              onDeleteFlow={handleFlowDelete}
              onSelectFlow={handleFlowSelect}
              selectedFlow={selectedFlow}
            />
          </div>
        </div>
      </main>
    </div>
  );
}