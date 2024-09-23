import { NextResponse } from "next/server";

/**
 * Validates required parameters and returns an error response if any are missing.
 *
 * @param params - An object containing parameter names and their values.
 * @returns Returns a NextResponse with an error if a parameter is missing, otherwise null.
 */
export function validateRequiredParams(
  params: Record<string, string | undefined | null>,
) {
  for (const [paramName, paramValue] of Object.entries(params)) {
    if (!paramValue) {
      return NextResponse.json(
        { error: `Missing ${paramName}` },
        { status: 400 },
      );
    }
  }
  return null;
}
