import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SourceDocument = {
  metadata: Record<string, string>;
  pageContent: string;
};

export type TMessage = {
  text: string;
  type: "user" | "bot";
  sourceDocuments?: SourceDocument[];
};

type Props = {
  message: TMessage;
};

const Message = ({ message }: Props) => {
  const [showSourceDocuments, setShowSourceDocuments] = useState(false);
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex w-full">
        <p
          className={cn(
            "max-w-[90%]",
            `${
              message.type === "user"
                ? "bg-zinc-800 rounded-3xl p-4 ml-auto"
                : ""
            }`
          )}
        >
          {message.text}
        </p>
      </div>
      {message.sourceDocuments && message.sourceDocuments.length > 0 && (
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => setShowSourceDocuments(!showSourceDocuments)}
            //  self-start to align the button to the start of the flex container and w-auto to make the button take the minimum width required
            className="w-auto self-start p-0 underline"
            variant={"link"}
          >
            {showSourceDocuments ? "Hide" : "Show"} Source Documents
          </Button>
          {showSourceDocuments &&
            message.sourceDocuments.map((source, index) => (
              <div key={index}>
                <p>Number # {index}</p>
                <p>{source.pageContent}</p>
                <pre>{JSON.stringify(source.metadata, null, 2)}</pre>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Message;
