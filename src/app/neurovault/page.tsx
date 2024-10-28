"use client";
import PromptInput from "@/components/PromptInput";
import ResponseAndSources from "@/components/ResponseAndSources";
import Title from "@/components/Title";

export default function NeurovaultHome() {
  return (
    <div className="flex flex-col w-full space-y-4 p-8 max-w-3xl sm:min-w-3xl mx-auto justify-center items-center min-h-screen">
      <Title title="Neurovault" />
      <ResponseAndSources messages={[]} />
      <PromptInput
        prompt=""
        handlePromptChange={() => {}}
        handlePromptSubmit={() => {}}
      />
    </div>
  );
}
