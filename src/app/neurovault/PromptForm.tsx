"use client";
import { TMessage } from "@/components/Message";
import PromptInput from "@/components/PromptInput";
import ResponseAndSources from "@/components/ResponseAndSources";
import { useEffect, useRef, useState } from "react";

const PromptForm = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const [messages, setMessages] = useState<TMessage[]>([
    {
      text: "Hello! I'm a bot who will remember everything about you. Use me to save your thoughts, ideas, and memories. I can also help you recall them later. Try me out by typing something below.",
      type: "bot",
    },
  ]);

  const fetchMessages = async (sid: string) => {
    try {
      const response = await fetch(`/api/getMessages?sessionId=${sid}`);
      const data = await response.json();
      console.log(data);
      if (data.messages) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMessages: TMessage[] = data.messages.map((msg: any) => ({
          text: msg.kwargs.content,
          type: msg.id.includes("HumanMessage") ? "user" : "bot",
        }));
        setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      const storedSessionId = localStorage.getItem("sessionId");
      if (storedSessionId) {
        setSessionId(storedSessionId);
        fetchMessages(storedSessionId);
      }
      hasFetched.current = true;
    }
  }, []);

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
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }
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
