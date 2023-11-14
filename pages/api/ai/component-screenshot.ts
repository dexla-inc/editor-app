import { GPT4_PREVIEW_MODEL, GPT4_VISION_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { getComponentScreenshotPrompt } from "@/utils/prompts";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionContentPart } from "openai/resources";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }

    const { description, responseType, image } = req.body;

    const prompt = getComponentScreenshotPrompt({ description, responseType });

    const contentMessages = [
      {
        type: "text",
        text: prompt,
      },
    ] as Array<ChatCompletionContentPart>;

    if (image) {
      contentMessages.push({
        type: "image_url",
        image_url: {
          url: image,
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: image ? GPT4_VISION_MODEL : GPT4_PREVIEW_MODEL,
      stream: false,
      max_tokens: 4096, // 4096 is our max until we spend more with open ai.
      messages: [
        {
          role: "user",
          content: contentMessages,
        },
      ],
    });

    const message = response.choices[0].message;

    try {
      const content = JSON.parse(message.content ?? "{}");
      return res.status(200).json(content);
    } catch (error) {
      return res.status(200).send(message.content || "");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}
