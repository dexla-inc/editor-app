import { cleanJson } from "@/utils/common";
import { openai } from "@/utils/openai";
import { ChatCompletionContentPart } from "openai/resources";

export default async function handler(req: Request) {
  try {
    const { body, method } = await req.json();
    if (method !== "POST") {
      throw new Error("Invalid method");
    }

    const { model, prompt, image } = body;

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
      model: model,
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
    try {
      const content = JSON.parse(cleanedJson ?? "{}");
      return Response.json(content, { status: 200 });
    } catch (error) {
      // If parsing as JSON fails, return the response as text
      return Response.json(message.content || "", { status: 200 }); // Return content as text or an empty string
    }

    // const stream = OpenAIStream(response);

    // const streamResponse = streamToResponse(stream, res);
    // return streamResponse;
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
