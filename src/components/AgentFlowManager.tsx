import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Assistant, AgentFlow } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AgentFlowManagerProps {
  assistants: Assistant[];
  flows: AgentFlow[];
  onCreateFlow: (flow: AgentFlow) => void;
  onDeleteFlow: (flowId: string) => void;
  onSelectFlow: (flow: AgentFlow) => void;
  selectedFlow: AgentFlow | null;
}

export function AgentFlowManager({
  assistants,
  flows,
  onCreateFlow,
  onDeleteFlow,
  onSelectFlow,
  selectedFlow,
}: AgentFlowManagerProps) {
  const [flowName, setFlowName] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const handleAddAgent = (agentId: string) => {
    setSelectedAgents((prev) => [...prev, agentId]);
  };

  const handleRemoveAgent = (index: number) => {
    setSelectedAgents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateFlow = () => {
    if (!flowName || selectedAgents.length < 2) {
      toast({
        title: "Chybějící údaje",
        description: "Prosím vyplňte název flow a přidejte alespoň dva agenty.",
        variant: "destructive",
      });
      return;
    }

    const newFlow: AgentFlow = {
      id: crypto.randomUUID(),
      name: flowName,
      agents: selectedAgents,
    };

    onCreateFlow(newFlow);
    setFlowName("");
    setSelectedAgents([]);

    toast({
      title: "Flow vytvořeno",
      description: `Flow ${flowName} bylo úspěšně vytvořeno.`,
    });
  };

  return (
    <div className="space-y-4 p-4 glass-card">
      <h2 className="text-2xl font-bold mb-4">Správa agentních flow</h2>
      
      <div className="space-y-4">
        <Input
          placeholder="Název flow"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
        />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Vybraní agenti:</p>
          <div className="flex flex-wrap gap-2">
            {selectedAgents.map((agentId, index) => {
              const agent = assistants.find((a) => a.id === agentId);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg"
                >
                  <span>{agent?.name}</span>
                  {index < selectedAgents.length - 1 && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAgent(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Dostupní agenti:</p>
          <div className="flex flex-wrap gap-2">
            {assistants.map((assistant) => (
              <Button
                key={assistant.id}
                variant="outline"
                onClick={() => handleAddAgent(assistant.id)}
                disabled={selectedAgents.includes(assistant.id)}
              >
                {assistant.name}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleCreateFlow}>
          <Plus className="h-4 w-4 mr-2" />
          Vytvořit flow
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Existující flow:</p>
        {flows.map((flow) => (
          <div
            key={flow.id}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
            onClick={() => onSelectFlow(flow)}
            role="button"
            tabIndex={0}
          >
            <div>
              <h3 className="font-medium">{flow.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {flow.agents.map((agentId, index) => {
                  const agent = assistants.find((a) => a.id === agentId);
                  return (
                    <span key={agentId} className="flex items-center gap-1">
                      {agent?.name}
                      {index < flow.agents.length - 1 && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFlow(flow.id);
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