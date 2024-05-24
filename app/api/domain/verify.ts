import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
  DomainVerificationStatusProps,
} from "@/utils/domains";

export default async function handler(req: Request) {
  const { method, query } = await req.json();
  if (method !== "GET") {
    throw new Error("Method not allowed");
  }

  const domain = query.domain as string;

  let status: DomainVerificationStatusProps = "Valid Configuration";

  const [domainJson, configJson] = await Promise.all([
    getDomainResponse(domain),
    getConfigResponse(domain),
  ]);

  if (domainJson?.error?.code === "not_found") {
    // domain not found on Vercel project
    status = "Domain Not Found";

    // unknown error
  } else if (domainJson.error) {
    status = "Unknown Error";

    // if domain is not verified, we try to verify now
  } else if (!domainJson.verified) {
    status = "Pending Verification";
    const verificationJson = await verifyDomain(domain);

    // domain was just verified
    if (verificationJson && verificationJson.verified) {
      status = "Valid Configuration";
    }
  } else if (configJson.misconfigured) {
    status = "Invalid Configuration";
  } else {
    status = "Valid Configuration";
  }

  return Response.json(
    {
      status,
      domainJson,
    },
    { status: 200 },
  );
}
