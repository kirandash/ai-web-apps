import { OpenAI } from "@langchain/openai";
// node js package for server-sent events to send uni directional messages to the client
import SSE from "express-sse";
import { NextResponse } from "next/server";

const sse = new SSE();
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const model = new OpenAI({
      streaming: true,
      maxTokens: 1000,
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            // console.log("token", token);
            sse.send(token, "newToken");
          },
        },
      ],
    });

    model.invoke(prompt).then(() => {
      sse.send(null, "end");
    });

    return NextResponse.json({ result: "OK" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}

// 🚨 TODO: Make the GET fn work. Currently only the POST is working. And we have a workaround solution by using Next.js Api routes: pages/api/streaming.ts
// export async function GET(): Promise<Response> {
//   sse.init();
//   return new Response("text event stream", {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }
