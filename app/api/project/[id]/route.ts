import { prisma } from "@/utils/prisma";

export async function GET(req: Request) {
  try {
    const { query } = await req.json();

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
