import { cleanJson } from "@/utils/common";
import { GPT4_PREVIEW_MODEL, GPT4_VISION_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import {
  getComponentScreenshotPrompt,
  getComponentsJsonPrompt,
} from "@/utils/prompts";
import faker from "@faker-js/faker";
import { ChatCompletionContentPart } from "openai/resources";

export function callFakerFunction(funcString: string) {
  try {
    return new Function("faker", `return ${funcString};`)(faker);
  } catch (error) {
    console.error("Error executing faker function:", error);
    return null;
  }
}

export const callFakerFuncs = (obj: any): any => {
  if (typeof obj === "string" && obj.startsWith("faker.")) {
    // Directly execute and return the result if the object itself is a faker string
    return callFakerFunction(obj);
  }

  if (Array.isArray(obj)) {
    // Map over the array and apply the function recursively
    return obj.map(callFakerFuncs);
  }

  if (obj !== null && typeof obj === "object") {
    // Recursively apply the function to each property of the object
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = callFakerFuncs(obj[key]);
      return acc;
    }, {});
  }

  // Return the object as is if it's not a string starting with "faker."
  return obj;
};

export default async function handler(req: Request) {
  try {
    const { body, method } = await req.json();
    if (method !== "POST") {
      throw new Error("Invalid method");
    }

    const { description, image, theme } = body;

    const isPromptWithScreenshot = image as boolean;

    const prompt = isPromptWithScreenshot
      ? getComponentScreenshotPrompt({ description, theme })
      : getComponentsJsonPrompt({ description, theme });

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
      model: isPromptWithScreenshot ? GPT4_VISION_MODEL : GPT4_PREVIEW_MODEL,
      ...(isPromptWithScreenshot
        ? {}
        : { response_format: { type: "json_object" } }),
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
      const resultWithFakerValues = callFakerFuncs(content);

      return Response.json(resultWithFakerValues, { status: 200 });
    } catch (error) {
      return Response.json(cleanedJson, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
