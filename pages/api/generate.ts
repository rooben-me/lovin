import type { NextApiRequest, NextApiResponse } from "next";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Transfer-Encoding", "chunked");

  const chat = new ChatOpenAI({
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token: string) {
          res.write(token);
        },
      },
    ],
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
  });

  async function generateChat(input: string) {
    await chain.call({
      input,
    });

    res.end();
  }

  if (req.method === "POST") {
    const { input } = req.body;
    generateChat(input);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
