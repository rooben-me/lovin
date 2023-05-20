import type { NextApiRequest, NextApiResponse } from "next";

import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { OpenAI } from "langchain";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = new OpenAI({ temperature: 0 });

  const parser = StructuredOutputParser.fromNamesAndDescriptions({
    communication_style: "Communication style",
    // communication_style_review: "Review of Communication style",
    communication_style_guage_value:
      "Number range of 1 to 100 for Communication style",
    emotional_tone: "Emotional tone",
    // emotional_tone_review: "Review of Emotional tone",
    emotional_tone_guage_value: "Number 1 to 100 for Emotional tone",
    shared_interests: "Shared interests",
    // shared_interests_review: "Review of Shared interests",
    shared_interests_guage_value:
      "Number range of 1 to 100 for Shared interests",
    compatibility_of_values: "Compatibility of values",
    // compatibility_of_values_review: "Review of Compatibility of values",
    compatibility_of_values_guage_value:
      "Number range of 1 to 100 for Compatibility of values",
    tips: "Tips to improve user compatibility",
  });

  const formatInstructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "You are Lovin, a personal love compatibility meter, you'll analyze the chat \n{format_instructions}\n{chat}\n",
    inputVariables: ["chat"],
    partialVariables: { format_instructions: formatInstructions },
  });

  async function generateChat(chat: string) {
    const input = await prompt.format({
      chat: chat,
    });

    const response = await model.call(input);

    const structuredResponse = await parser.parse(response);

    res.status(200).json(structuredResponse);
  }

  if (req.method === "POST") {
    const { input } = req.body;
    generateChat(input);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
