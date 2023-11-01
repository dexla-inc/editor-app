import { GPT4_MODEL, openai } from "@/utils/openai";
import { getComponentsPrompt } from "@/utils/prompts";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const { description } = req.body;

    const chatStream = await openai.chat.completions.create({
      model: GPT4_MODEL,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a B2B Web App Component Builder System (WACBG) that generates a component structure based on a given user input.`,
        },
        {
          role: "user",
          content: getComponentsPrompt({
            description: description ?? "",
          }),
        },
      ],
    });

    let messageBuilder = "";

    for await (const chunk of chatStream) {
      const chatChoice = chunk.choices[0]; // Assuming choices always has at least one element
      const content = chatChoice.delta.content ?? "";

      if (content.endsWith("\n")) {
        if (messageBuilder.length > 0) {
          messageBuilder += content.replace("\n", "");
          const completeMessage = messageBuilder;

          res.write(`data: ${JSON.stringify(completeMessage)}\n\n`);
          console.log(`data: ${JSON.stringify(completeMessage)}\n\n`);

          messageBuilder = "";
        }
      } else {
        messageBuilder += content;
      }
    }

    res.end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
