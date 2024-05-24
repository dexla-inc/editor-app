import { getTemplate } from "@/requests/templates/queries-noauth";

export async function GET(req: Request) {
  try {
    const { query } = await req.json();

    const { name } = query;

    const includeTiles = false;

    const template = await getTemplate(name as string, includeTiles);

    return Response.json(template, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
