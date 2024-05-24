import { getTemplate } from "@/requests/templates/queries-noauth";

export default async function handler(req: Request) {
  try {
    const { query, method } = await req.json();
    if (req.method !== "GET") {
      throw new Error("Invalid method");
    }

    const { name } = query;

    const includeTiles = false;

    const template = await getTemplate(name as string, includeTiles);

    return Response.json(template, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
