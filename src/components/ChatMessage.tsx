import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  agentName?: string;
}

export function ChatMessage({ content, role, agentName }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg animate-fade-in",
        role === "user"
          ? "bg-primary/10 ml-auto max-w-[80%]"
          : "bg-secondary/50 mr-auto max-w-[80%]"
      )}
    >
      <div className="flex flex-col gap-1">
        {agentName && (
          <span className="text-xs font-medium text-muted-foreground">
            {agentName}
          </span>
        )}
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}