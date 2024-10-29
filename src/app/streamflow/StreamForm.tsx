"use client";
import PromptInput from "@/components/PromptInput";
import StreamResponse from "@/components/StreamResponse";
import { useEffect, useState } from "react";

const StreamForm = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [source, setSource] = useState<EventSource | null>(null);
  const [data, setData] = useState<string | null>(null);

  const sanitizeToken = (token: string) => {
    // Replace newline characters and remove quotes
    return token.replace(/\\n/g, "\n").replace(/"/g, "");
    // return token;
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handlePromptSubmit = async () => {
    setData(null);
    try {
      await fetch("/api/streaming", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      // close the source if it exists
      if (source) {
        source.close();
      }

      // Create new event source
      const newSource = new EventSource(`/api/streaming`);
      setSource(newSource);

      // on message set the data
      newSource.addEventListener("newToken", (event) => {
        const token = sanitizeToken(event.data);
        setData((prevData) => (prevData ? prevData + token : token));
      });

      // on end of stream close the source
      newSource.addEventListener("end", () => {
        newSource.close();
      });

      setPrompt("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      if (source) {
        source.close();
      }
    };
  }, [source]);

  return (
    <>
      <StreamResponse data={data} />
      <PromptInput
        prompt={prompt}
        handlePromptChange={handlePromptChange}
        handlePromptSubmit={handlePromptSubmit}
        error={error}
      />
    </>
  );
};

export default StreamForm;
