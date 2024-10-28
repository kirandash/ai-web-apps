import { getRedisClient } from "@/lib/redis";
import { ChatOpenAI } from "@langchain/openai";
import { RedisChatMessageHistory } from "@langchain/redis";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const { prompt, sessionId: existingSessionId } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const redisClient = getRedisClient();
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  try {
    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    // Note: This is a simple example. In a real-world application, you would want to create a new session for each user.
    const sessionId = existingSessionId || uuidv4();

    const memory = new BufferMemory({
      chatHistory: new RedisChatMessageHistory({
        sessionId,
        sessionTTL: 300,
        client: redisClient,
      }),
    });

    const chain = new ConversationChain({ llm: model, memory });

    const { response } = await chain.invoke({
      input: prompt,
    });
    return NextResponse.json({ text: response, sessionId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}
