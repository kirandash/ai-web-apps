import { cn } from "@/lib/utils";

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
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex">
        <p
          className={cn(
            "max-w-[90%]",
            `${message.type === "user" ? "zinc-800 rounded-2xl" : ""}`
          )}
        >
          {message.text}
        </p>
      </div>
      {message.sourceDocuments && message.sourceDocuments.length > 0 && (
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-bold">Sources:</p>
          {message.sourceDocuments.map((source, index) => (
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
