import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

const main = async () => {
  // 1. Prompt Template
  const promptTemplate = PromptTemplate.fromTemplate(
    "Tell me a joke about {topic}"
  );

  // This manual invoking is not needed if we use the LLMChain
  await promptTemplate.invoke({ topic: "cats" });

  const chatPromptTemplate = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that can tell jokes. Don't do anything else.",
    ],
    ["user", "Tell me a joke that includes both {topic1} and {topic2}"],
  ]);

  // This manual invoking is not needed if we use the LLMChain
  await chatPromptTemplate.invoke({ topic1: "cats", topic2: "dogs" });

  console.log({
    promptTemplate,
    chatPromptTemplate: JSON.stringify(chatPromptTemplate, null, 2),
  });
};

main();
