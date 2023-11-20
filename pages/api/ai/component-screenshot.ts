import { GPT4_VISION_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import {
  getComponentScreenshotPrompt,
  getComponentsJsonPrompt,
} from "@/utils/prompts";
import faker from "@faker-js/faker";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionContentPart } from "openai/resources";

export function callFakerFunction(funcString: string) {
  try {
    const fakerFunction = new Function("faker", `return ${funcString};`)(faker);
    return fakerFunction();
  } catch (error) {
    console.error("Error executing faker function:", error);
    return null; // or some default value
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
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = callFakerFuncs(obj[key]);
      return acc;
    }, {});
  }

  // Return the object as is if it's not a string starting with "faker."
  return obj;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  try {
    if (req.method !== "POST") {
      throw new Error("Invalid method");
    }

    const { description, image, theme } = req.body;

    const prompt = image
      ? getComponentScreenshotPrompt({ description, theme })
      : getComponentsJsonPrompt({ description, theme });

    console.log(prompt);
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
      max_tokens: 4096, // 4096 is our max until we spend more with open ai.
      messages: [
        {
          role: "user",
          content: contentMessages,
        },
      ],
    });

    const message = response.choices[0].message;
    const cleanedJson = cleanJson(message.content);
    console.log("content", cleanedJson);

    try {
      const content = JSON.parse(cleanedJson ?? "{}");
      const resultWithFakerValues = callFakerFuncs(content);
      console.log(resultWithFakerValues);
      return res.status(200).json(resultWithFakerValues);
    } catch (error) {
      return res.status(200).send(cleanedJson || "");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

// Move to common file
function cleanJson(json: string | null) {
  return json?.replace("```json", "").replace("```", "");
}
