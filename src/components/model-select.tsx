import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModelSelectProps {
  models: string[];
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const ModelSelect = ({
  models,
  value,
  onChange,
  isLoading,
}: ModelSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model} value={model}>
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { ModelSelect };
