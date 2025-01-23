import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelect } from "@/components/ModelSelect";
import { AssistantManager } from "@/components/AssistantManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add this import
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Message, Assistant, AgentFlow, ModelProvider } from "@/types";
import { generateResponse } from "@/services/ai";
import {
  saveMessages,
  loadMessages,
  loadApiKey,
  saveApiKey,
  loadAssistants,
} from "@/services/storage";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelProvider>("gemini-pro"); // Fix the type here
  const [apiKey, setApiKey] = useState(loadApiKey());
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMessages(loadMessages());
    setAssistants(loadAssistants());
  }, []);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (apiKey) {
      saveApiKey(apiKey);
    }
  }, [apiKey]);

  const handleSend = async (message: string) => {
    if (!apiKey) {
      toast({
        title: "API klíč není nastaven",
        description: "Prosím nastavte API klíč pro zvoleného poskytovatele.",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      const response = await generateResponse(message, selectedModel, apiKey);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        agentName: selectedModel,
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

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <ModelSelect value={selectedModel} onChange={setSelectedModel} />
            <Input
              type="password"
              placeholder="API klíč"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-64"
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container pt-20 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="chat-container">
              <div className="message-container">
                {messages.map((message, index) => (
                  <ChatMessage key={index} {...message} />
                ))}
              </div>
              <div className="input-container">
                <ChatInput onSend={handleSend} disabled={isProcessing} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <AssistantManager />
          </div>
        </div>
      </main>
    </div>
  );
}