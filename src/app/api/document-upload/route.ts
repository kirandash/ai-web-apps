import { pineconeIndex } from "@/lib/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This will work on local machine only. You need to handle this in a different way for production.
    const relationShipsGuidePath =
      "/Users/kirandash/workspace/bgwebagency/ai-web-apps/assets/Relationships_Guide_Kiran_Dash_BG_Web_Agency.pdf";

    const loader = new PDFLoader(relationShipsGuidePath);

    const docs = await loader.load();

    if (!docs || docs.length === 0) {
      return NextResponse.json(
        { error: "An error occurred while fetching messages" },
        { status: 500 }
      );
    }

    const textSplitter = new CharacterTextSplitter({
      separator: " ", // "\n\n", "\n", " ", etc.
      chunkSize: 500,
      chunkOverlap: 100,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    const splitDocsWithCleanMetadata = splitDocs.map((doc) => {
      const cleanedMetadata = {
        ...doc.metadata,
      };
      // Remove any unwanted metadata fields
      delete cleanedMetadata.pdf;
      return new Document({
        pageContent: doc.pageContent,
        metadata: cleanedMetadata,
      });
    });

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
    });

    await PineconeStore.fromDocuments(splitDocsWithCleanMetadata, embeddings, {
      pineconeIndex,
    });

    return NextResponse.json({ result: docs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching messages" },
      { status: 500 }
    );
  }
}
