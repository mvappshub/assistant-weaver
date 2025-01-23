import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelProvider } from "@/types";

interface ModelSelectProps {
  value: ModelProvider;
  onChange: (value: ModelProvider) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
        <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
      </SelectContent>
    </Select>
  );
}