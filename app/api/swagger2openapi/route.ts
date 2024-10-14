import { NextResponse } from "next/server";
import swagger2openapi from "swagger2openapi";
import { validateRequiredParams } from "@/app/api/helper";

export async function GET(request: Request) {
  const storageBaseUrl = process.env.NEXT_PUBLIC_APPS_BASE_URL as string;

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const baseUrl = searchParams.get("baseUrl");
  const relativeUrl = searchParams.get("relativeUrl");
  const apiKey = searchParams.get("apiKey");
  const type = searchParams.get("type");

  const requiredParams = {
    projectId,
    baseUrl,
    relativeUrl,
    apiKey,
    type,
  };
  const validationResponse = validateRequiredParams(requiredParams);

  if (validationResponse) {
    return validationResponse;
  }

  try {
    const url = `${baseUrl}${relativeUrl}?apikey=${apiKey}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/openapi+json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching Swagger spec: ${response.status} ${response.statusText}`,
      );
    }

    const swaggerSpec = await response.json();

    const options = {};
    const { openapi } = await swagger2openapi.convertObj(swaggerSpec, options);

    const openapiJson = JSON.stringify(openapi);
    const blob = new Blob([openapiJson], { type: "application/json" });

    const formData = new FormData();
    formData.append("file", blob, "openapi.json");

    const storageUrl = `${storageBaseUrl}/projects/${projectId}/storage/internal`;

    const uploadResponse = await fetch(storageUrl, {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `Error uploading OpenAPI spec: ${uploadResponse.statusText}`,
      );
    }

    const result = await uploadResponse.json();

    return NextResponse.json(result, { status: uploadResponse.status });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
