import { addDomainToVercel } from "@/utils/domains";

export default async function handler(req: Request) {
  try {
    const { body, method } = await req.json();
    if (method !== "POST") {
      throw new Error("Method not allowed");
    }

    const domain = body.domain as string;

    const response = await addDomainToVercel(domain);

    return Response.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
