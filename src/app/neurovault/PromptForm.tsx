"use client";
import { TMessage } from "@/components/Message";
import PromptInput from "@/components/PromptInput";
import ResponseAndSources from "@/components/ResponseAndSources";
import { useState } from "react";

const PromptForm = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<TMessage[]>([
    {
      text: "Hello! I'm a bot who will remember everything about you. Use me to save your thoughts, ideas, and memories. I can also help you recall them later. Try me out by typing something below.",
      type: "bot",
    },
  ]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handlePromptSubmit = async () => {
    // console.log("Submit", prompt);
    try {
      const response = await fetch("/api/neurovault", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          sessionId: localStorage.getItem("sessionId"),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `An error occurred. Please try again. Status: ${response.status}`
        );
      }

      const data = await response.json();
      localStorage.setItem("sessionId", data.sessionId);
      setMessages([
        ...messages,
        { text: prompt, type: "user" },
        { text: data.text, type: "bot" },
      ]);
      setPrompt("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
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
      />
    </>
  );
};

export default PromptForm;
