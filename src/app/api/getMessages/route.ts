import { getRedisClient } from "@/lib/redis";
import { RedisChatMessageHistory } from "@langchain/redis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID is required" },
      { status: 400 }
    );
  }

  const redisClient = getRedisClient();
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  try {
    const history = new RedisChatMessageHistory({
      sessionId,
      sessionTTL: 300,
      client: redisClient,
    });

    const messages = await history.getMessages();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching messages" },
      { status: 500 }
    );
  }
}
