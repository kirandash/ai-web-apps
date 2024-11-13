import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
// import {ConversationalRetrievalChain} from "langchain/chains";
// import { CharacterTextSplitter } from "@langchain/textsplitters";

export const runtime = "nodejs";

let chain;
const chatHistory = [];

const initChain = async (initialPrompt, transcript) => {
  try {
    const model = new ChatOpenAI({
      temperature: 0.8,
    });

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    console.log("initialPrompt", initialPrompt);

    const vectorStore = await HNSWLib.fromDocuments(
      [
        {
          pageContent: transcript,
          metadata: {},
        },
      ],
      embeddings
    );

    console.log("vectorStore", vectorStore);

    const directory =
      "/Users/kirandash/workspace/bgwebagency/ai-web-apps/src/app/api/video-interact";

    console.log("directory", directory);

    await vectorStore.save(directory);

    console.log("saved");

    const loadedVectorStore = await HNSWLib.load(directory, embeddings);
  } catch (error) {
    console.error(error);
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

      chatHistory.push({
        role: "user",
        content: initialPrompt,
      });

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

      return NextResponse.json({ result: "", chatHistory });
    } catch {
      return NextResponse.json({
        error: "An error occurred. Please try again",
      });
    }
  } else {
  }

  try {
    return NextResponse.json({ result: "" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred. Please try again" });
  }
}
