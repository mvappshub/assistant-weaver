import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelect } from "@/components/ModelSelect";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  agentName?: string;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-pro");
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");

  const handleSend = async (message: string) => {
    const newMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, newMessage]);

    // TODO: Implement API calls to selected model
    // For now, just echo the message
    const response: Message = {
      role: "assistant",
      content: `Echo: ${message}`,
      agentName: selectedModel,
    };
    setMessages((prev) => [...prev, response]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <ModelSelect value={selectedModel} onChange={setSelectedModel} />
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container pt-14">
        <div className="chat-container">
          <div className="message-container">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
          </div>
          <div className="input-container">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </main>
    </div>
  );
}