import { addDomainToVercel } from "@/utils/domains";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    const response = await addDomainToVercel(domain);

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
