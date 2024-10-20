import { OpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

const main = async () => {
  // 5. Memory
  const model = new OpenAI({
    temperature: 0, // Temperature decides the randomness of the output
    verbose: true,
  });

  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory });
  const input = "Hi! I'm Narendra Modi, the prime minister of India!";
  const res = await chain.invoke({
    input,
  });

  console.log({ res });

  const input2 = "Who are all my ministers?";
  const res2 = await chain.invoke({
    input: input2,
  });
  console.log({ res2 });
};

main();
