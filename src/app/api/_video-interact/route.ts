import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export const runtime = "nodejs";

let chain: ConversationalRetrievalQAChain | undefined;
const chatHistory: BaseMessage[] = [];

const initChain = async (initialPrompt: string, transcript: string) => {
  try {
    const chatModel = new ChatOpenAI({
      temperature: 0.8,
    });

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const textSplitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const docs = await textSplitter.createDocuments([transcript]);
    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);

    const directory =
      "/Users/kirandash/workspace/bgwebagency/ai-web-apps/src/app/api/video-interact";

    await vectorStore.save(directory);
    await HNSWLib.load(directory, embeddings);

    chain = ConversationalRetrievalQAChain.fromLLM(
      chatModel,
      vectorStore.asRetriever(),
      { verbose: true }
    );

    const response = await chain.call({
      question: initialPrompt,
      chat_history: chatHistory,
    });

    chatHistory.push(new AIMessage(response.text));
    return response;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export async function POST(req: Request) {
  const { prompt, firstMsg } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (firstMsg) {
    try {
      const initialPrompt = `Give me a summary of the transcript: ${prompt}`;

      chatHistory.push(new HumanMessage(initialPrompt));

      const transcriptResponse = await YoutubeTranscript.fetchTranscript(
        prompt
      );

      if (!transcriptResponse) {
        return NextResponse.json(
          { error: "Transcript not found" },
          { status: 400 }
        );
      }

      let transcript = "";
      transcriptResponse.forEach((item) => {
        transcript += item.text + " ";
      });

      const response = await initChain(initialPrompt, transcript);

      return NextResponse.json({ result: response, chatHistory });
    } catch (error: unknown) {
      console.error("Error processing first message:", error);
      return NextResponse.json({
        error: "An error occurred. Please try again",
      });
    }
  }

  try {
    chatHistory.push(new HumanMessage(prompt));

    if (!chain) {
      return NextResponse.json(
        { error: "Chain not initialized" },
        { status: 500 }
      );
    }

    const response = await chain.call({
      question: prompt,
      chat_history: chatHistory,
    });

    return NextResponse.json({ result: response, chatHistory });
  } catch (error: unknown) {
    console.error("Error processing message:", error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}
