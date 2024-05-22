import { cleanJson } from "@/utils/common";
import { GPT4_VISION_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { getThemeScreenshotPrompt } from "@/utils/prompts-theme";
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

    const { description, image } = req.body;

    const prompt = getThemeScreenshotPrompt({ description });

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
      model: GPT4_VISION_MODEL,
      stream: false,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: contentMessages,
        },
      ],
    });

    const message = response.choices[0].message;
    const cleanedJson = cleanJson(message.content);

    try {
      const content = JSON.parse(cleanedJson ?? "{}");

      return res.status(200).json(content);
    } catch (error) {
      return res.status(200).send(cleanedJson || "");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
}
