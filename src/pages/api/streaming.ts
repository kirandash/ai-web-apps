import { OpenAI } from "@langchain/openai";
import SSE from "express-sse";
import { NextApiRequest, NextApiResponse } from "next";
const sse = new SSE();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
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

      model
        .invoke(prompt)
        .then(() => {
          sse.send(null, "end");
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(500)
            .json({ error: "An error occurred. Please try again" });
        });

      return res.json({ result: "OK" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occurred. Please try again" });
    }
  } else if (req.method === "GET") {
    sse.init(req, res);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
