import { prisma } from "@/utils/prisma";

export default async function handler(req: Request) {
  try {
    const { query, method } = await req.json();
    if (req.method !== "GET") {
      throw new Error("Invalid method");
    }

    const { id } = query;
    const project = await prisma.project.findFirstOrThrow({
      where: {
        id: id as string,
      },
    });

    return Response.json(project, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
