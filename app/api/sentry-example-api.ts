// A faulty API route to test Sentry's error monitoring
export default function handler(_req: any, res: any) {
  throw new Error("Sentry Example API Route Error");
  return Response.json({ name: "John Doe" }, { status: 200 });
}
