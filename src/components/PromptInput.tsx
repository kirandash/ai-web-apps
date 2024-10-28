"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  prompt: string;
  handlePromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePromptSubmit: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
};

const PromptInput = ({
  prompt,
  handlePromptChange,
  handlePromptSubmit,
  placeholder,
  error,
  disabled,
}: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePromptSubmit();
    }
  };

  return (
    <div className="flex items-center w-full flex-col space-y-2">
      <div className="flex w-full">
        <Input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type your message here..."}
        />
        <Button
          onClick={handlePromptSubmit}
          disabled={disabled}
          className="ml-2"
        >
          Send
        </Button>
      </div>
      <p className="text-red-500 ml-2">{error}</p>
    </div>
  );
};

export default PromptInput;
