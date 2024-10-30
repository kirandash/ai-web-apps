import { pineconeIndex } from "@/lib/pinecone";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
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

    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt: prompt,
    });

    const chain = await createRetrievalChain({
      retriever: vectorStore.asRetriever(),
      combineDocsChain,
    });

    const response = await chain.invoke({
      input: prompt,
    });

    return NextResponse.json({ result: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}
