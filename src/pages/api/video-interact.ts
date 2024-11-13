import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { NextApiRequest, NextApiResponse } from "next";
import { YoutubeTranscript } from "youtube-transcript";

let chain;
const chatHistory = [];

const initChain = async (initialPrompt, transcript) => {
  try {
    const model = new ChatOpenAI({
      temperature: 0.8,
    });

    const textSplitter = new CharacterTextSplitter({
      separator: " ", // "\n\n", "\n", " ", etc.
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const docs = await textSplitter.createDocuments([transcript]);

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    const vectorStore = await HNSWLib.fromDocuments(docs, embeddings);

    try {
      const directory =
        "/Users/kirandash/workspace/bgwebagency/ai-web-apps/src/hnswlibstore";
      await vectorStore.save(directory);
      const loadedVectorStore = await HNSWLib.load(directory, embeddings);
    } catch (error) {}

    chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      { verbose: true }
    );

    const response = await chain.call({
      question: initialPrompt,
      chat_history: chatHistory,
    });

    // chatHistory.push({
    //   role: "assistant",
    //   content: response.text,
    // });
    chatHistory.push(new AIMessage(response.text));

    return response;
  } catch (error) {
    console.error(error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { prompt, firstMsg } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (firstMsg) {
      try {
        // For first message, we provide the summary to user based on the transcript
        const initialPrompt = `Give me a summary of the transcript`;

        // chatHistory.push({
        //   role: "user",
        //   content: initialPrompt,
        // });
        chatHistory.push(new HumanMessage(initialPrompt));

        const transcriptResponse = await YoutubeTranscript.fetchTranscript(
          prompt
        );

        if (!transcriptResponse) {
          return res.status(400).json({ error: "Transcript not found" });
        }

        let transcript = "";
        transcriptResponse.forEach((item) => {
          transcript += item.text + " ";
        });

        const response = await initChain(initialPrompt, transcript);

        return res.json({ result: response, chatHistory });
      } catch {
        return res.json({
          error: "An error occurred. Please try again",
        });
      }
    } else {
      try {
        chatHistory.push(new HumanMessage(prompt));

        const response = await chain.call({
          question: prompt,
          chat_history: chatHistory,
        });

        return res.status(200).json({ result: response, chatHistory });
      } catch (error) {
        console.error(error);
        return res.json({ error: "An error occurred. Please try again" });
      }
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
