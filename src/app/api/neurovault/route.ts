import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { NextResponse } from "next/server";

let model: OpenAI;
let memory: BufferMemory;
let chain: ConversationChain;

export async function POST(req: Request) {
  const { prompt, firstMessage } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (firstMessage) {
    console.log("Initiating chain... ⏳");
    if (!model) {
      model = new OpenAI({
        // Note that your response will change based on the model you are using and can be more or less accurate. Feel free to try by commenting/uncommenting the model below.
        model: "gpt-3.5-turbo",
        temperature: 0,
      });
    }

    if (!memory) {
      memory = new BufferMemory();
    }

    if (!chain) {
      chain = new ConversationChain({ llm: model, memory });
    }
  }

  try {
    const { response } = await chain.invoke({
      input: prompt,
    });
    return NextResponse.json({ text: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}
