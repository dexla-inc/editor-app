import { cleanJson } from "@/utils/common";
import { GPT4_VISION_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { getThemeScreenshotPrompt } from "@/utils/prompts-theme";
import { ChatCompletionContentPart } from "openai/resources";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    const { description, image } = body;

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

      return Response.json(content, { status: 200 });
    } catch (error) {
      return Response.json(cleanedJson, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
