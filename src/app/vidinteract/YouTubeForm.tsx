"use client";
import { TMessage } from "@/components/Message";
import PromptInput from "@/components/PromptInput";
import ResponseAndSources from "@/components/ResponseAndSources";
import { useState } from "react";

const YouTubeForm = () => {
  const [prompt, setPrompt] = useState(
    // "https://www.youtube.com/watch?v=QBdXYfexv2s"
    ""
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstMsg, setFirstMsg] = useState(true);
  const [messages, setMessages] = useState<TMessage[]>([
    {
      text: "Hello! I'm a bot who will answer your questions about a youtube video. Please paste the youtube video link below and ask your question.",
      type: "bot",
    },
  ]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handlePromptSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/video-interact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          firstMsg,
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
        },
      ]);
      setPrompt("");
      setError("");
      setFirstMsg(false);
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ResponseAndSources messages={messages} />
      <PromptInput
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        handlePromptSubmit={handlePromptSubmit}
        error={error}
        disabled={isLoading}
        placeholder={
          messages.length === 1
            ? "Paste the youtube video link here..."
            : "Ask a question about the video..."
        }
      />
    </>
  );
};

export default YouTubeForm;
