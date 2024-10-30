import { pineconeIndex } from "@/lib/pinecone";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const model = new OpenAI();

    if (!model) {
      throw new Error("Failed to initialize OpenAI model");
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });

    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 1, // Number of documents to be used to build the context. Use a larger number ex: 5 if your chunk size is too small to provide enough context about the query
      returnSourceDocuments: true,
    });

    const response = await chain.call({
      query: prompt,
    });

    return NextResponse.json({ result: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}
