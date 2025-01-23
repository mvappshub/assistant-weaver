import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelect } from "@/components/ModelSelect";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  agentName?: string;
}

interface Assistant {
  id: string;
  name: string;
  role: string;
  model: string;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-pro");
  const [apiKey, setApiKey] = useState(localStorage.getItem("apiKey") || "");
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("messages");
    const savedAssistants = localStorage.getItem("assistants");
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    
    if (savedAssistants) {
      setAssistants(JSON.parse(savedAssistants));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("assistants", JSON.stringify(assistants));
  }, [assistants]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey);
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

    // Echo message for now - API implementation will be added later
    const response: Message = {
      role: "assistant",
      content: `Echo: ${message}`,
      agentName: selectedModel,
    };
    setMessages((prev) => [...prev, response]);
  };

  const handleAddAssistant = () => {
    const newAssistant: Assistant = {
      id: crypto.randomUUID(),
      name: "Nový asistent",
      role: "generátor nápadů",
      model: selectedModel,
    };
    setAssistants((prev) => [...prev, newAssistant]);
    toast({
      title: "Asistent přidán",
      description: "Nový asistent byl úspěšně vytvořen.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <ModelSelect value={selectedModel} onChange={setSelectedModel} />
            <Button variant="outline" size="icon" onClick={handleAddAssistant}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container pt-20 pb-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
          </div>
          <div className="mt-auto">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </main>
    </div>
  );
}