import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelect } from "@/components/ModelSelect";
import { Assistant, ModelProvider } from "@/types";
import { saveAssistants, loadAssistants } from "@/services/storage";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AssistantManagerProps {
  assistants: Assistant[];
  onSelect: (assistant: Assistant) => void;
  onCreate: (assistant: Assistant) => void;
  onUpdate: (updatedAssistant: Assistant) => void;
  onDelete: (assistantId: string) => void;
  selectedAssistant: Assistant | null;
}

export function AssistantManager({
  assistants,
  onSelect,
  onCreate,
  onUpdate,
  onDelete,
  selectedAssistant
}: AssistantManagerProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [model, setModel] = useState<ModelProvider>("gemini-pro");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleAddAssistant = () => {
    if (!name || !role) {
      toast({
        title: "Chybějící údaje",
        description: "Prosím vyplňte jméno a roli asistenta.",
        variant: "destructive",
      });
      return;
    }

    const newAssistant: Assistant = {
      id: crypto.randomUUID(),
      name,
      role,
      model,
      systemPrompt,
    };

    onCreate(newAssistant);

    setName("");
    setRole("");
    setSystemPrompt("");

    toast({
      title: "Asistent vytvořen",
      description: `Asistent ${name} byl úspěšně vytvořen.`,
    });
  };

  return (
    <div className="space-y-4 p-4 glass-card">
      <h2 className="text-2xl font-bold mb-4">Správa asistentů</h2>
      
      <div className="space-y-4">
        <Input
          placeholder="Jméno asistenta"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Role asistenta"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <ModelSelect value={model} onChange={setModel} />
        <Textarea
          placeholder="Systémový prompt (volitelné)"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
        <Button onClick={handleAddAssistant}>
          <Plus className="h-4 w-4 mr-2" />
          Přidat asistenta
        </Button>
      </div>

      <div className="space-y-2">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
            onClick={() => onSelect(assistant)}
            role="button"
            tabIndex={0}
          >
            <div>
              <h3 className="font-medium">{assistant.name}</h3>
              <p className="text-sm text-muted-foreground">{assistant.role}</p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(assistant.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}