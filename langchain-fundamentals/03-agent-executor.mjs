import { OpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { DadJokeAPI } from "@langchain/community/tools/dadjokeapi";

const main = async () => {
  // 3. Agent Executor
  const modelAgent = new OpenAI({
    temperature: 0, // Temperature decides the randomness of the output
    // modelName: "gpt-4-turbo", // optional
  });

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "Singapore",
      hl: "en",
      gl: "sg",
    }),
    new DadJokeAPI(),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, modelAgent, {
    agentType: "zero-shot-react-description",
    verbose: true,
    maxIterations: 5,
  });

  const resAgent = await executor.invoke({
    input: `Tell a joke about dogs`,
  });

  console.log({ resAgent });
};

main();
