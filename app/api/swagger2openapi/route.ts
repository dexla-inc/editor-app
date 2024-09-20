import { NextResponse } from "next/server";
import swagger2openapi from "swagger2openapi";
import { validateRequiredParams } from "@/app/api/helper";

export async function GET(request: Request) {
  const internalStorageBaseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  // Get base URL, auth value, and access token dynamically from the request
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const baseUrl = searchParams.get("baseUrl");
  const relativeUrl = searchParams.get("relativeUrl");
  const apiKey = searchParams.get("apiKey");
  const accessToken = searchParams.get("accessToken");
  const type = searchParams.get("type");

  const requiredParams = {
    projectId,
    baseUrl,
    relativeUrl,
    apiKey,
    accessToken,
    type,
  };
  const validationResponse = validateRequiredParams(requiredParams);

  if (validationResponse) {
    return validationResponse;
  }

  try {
    const url = `${baseUrl}${relativeUrl}?apikey=${apiKey}`;

    // Fetch the Swagger 2.0 specification from Supabase
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

    // Convert Swagger 2.0 spec to OpenAPI 3.0
    const options = {};
    const { openapi } = await swagger2openapi.convertObj(swaggerSpec, options);

    // Upload the converted OpenAPI spec to the internal storage endpoint
    const openapiJson = JSON.stringify(openapi);
    const blob = new Blob([openapiJson], { type: "application/json" });

    // Step 4: Create form data (if the API requires multipart upload)
    const formData = new FormData();
    formData.append("file", blob, "openapi.json");

    // Step 5: Upload the JSON file to the internal storage endpoint
    const storageUrl = `${internalStorageBaseUrl}/projects/${projectId}/storage`;

    const uploadResponse = await fetch(storageUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*",
      },
      body: formData, // Sending form data with the JSON file
    });

    // Read the response body

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
