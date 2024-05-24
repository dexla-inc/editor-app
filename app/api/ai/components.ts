import { GPT4_PREVIEW_MODEL } from "@/utils/config";
import { openai } from "@/utils/openai";
import { getComponentsPrompt } from "@/utils/prompts";

// This needs to be a stream
export default async function handler(req: Request) {
  try {
    const { body, method, setHeader } = await req.json();
    if (method !== "POST") {
      throw new Error("Invalid method");
    }

    // TODO: GET THIS BACK
    // setHeader("Content-Type", "text/event-stream");
    // setHeader("Cache-Control", "no-cache");
    // setHeader("Connection", "keep-alive");

    const { description } = body;

    const chatStream = await openai.chat.completions.create({
      model: GPT4_PREVIEW_MODEL,
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

          // res.write(`data: ${JSON.stringify(completeMessage)}\n\n`);

          messageBuilder = "";
        }
      } else {
        messageBuilder += content;
      }
    }

    // res.end();
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
