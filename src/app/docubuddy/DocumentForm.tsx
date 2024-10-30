"use client";
import { TMessage } from "@/components/Message";
import PromptInput from "@/components/PromptInput";
import ResponseAndSources from "@/components/ResponseAndSources";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DocumentForm = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<TMessage[]>([
    {
      text: "Hello! I'm a bot who will answer your questions about a document. Try me out by typing something below.",
      type: "bot",
    },
  ]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleLoadDocument = async () => {
    setIsLoading(true);
    try {
      // This API will load document from our file system and save the embeddings in the database
      const response = await fetch("/api/document-upload", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("An error occurred. Please try again.");
      }

      await response.json();
      setError("");
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/document-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("An error occurred. Please try again.");
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: prompt,
          type: "user",
        },
        {
          text: data.result.text,
          type: "bot",
          sourceDocuments: data.result.sourceDocuments,
        },
      ]);
      setPrompt("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleLoadDocument}>Load Document</Button>
      <ResponseAndSources messages={messages} />
      {/* Creating this to load a document for our use case because we don't want to work on file uploading for this project */}

      <PromptInput
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        handlePromptSubmit={handlePromptSubmit}
        error={error}
        disabled={isLoading}
      />
    </>
  );
};

export default DocumentForm;
