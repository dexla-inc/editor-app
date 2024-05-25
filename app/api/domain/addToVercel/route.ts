import { addDomainToVercel } from "@/utils/domains";

export async function POST(req: Request) {
  try {
    const { body } = await req.json();

    const domain = body.domain as string;

    const response = await addDomainToVercel(domain);

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
