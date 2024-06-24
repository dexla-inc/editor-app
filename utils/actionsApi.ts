import { MethodTypes } from "@/requests/types";
import { readDataFromStream } from "@/utils/api";
import { Endpoint, MediaTypes } from "@/requests/datasources/types";
import { extractPagingFromSupabase, notUndefined } from "@/utils/common";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { ValueProps } from "@/types/dataBinding";

export function constructHeaders(
  mediaType?: MediaTypes,
  headers?: any,
  authHeaderKey = "",
) {
  const contentType = mediaType || "application/json";

  const { Authorization, ...restHeaders } = headers || {};

  return {
    "Content-Type": contentType,
    ...restHeaders,
    ...(Authorization
      ? { Authorization }
      : authHeaderKey
        ? { Authorization: authHeaderKey }
        : {}),
  };
}

// Function to perform the fetch operation
export async function performFetch(
  url: string,
  methodType?: MethodTypes,
  headers?: any,
  body?: any,
  mediaType: MediaTypes = "application/json",
  authHeaderKey?: string,
) {
  const isGetMethodType = methodType === "GET";

  const _headers = constructHeaders(mediaType, headers, authHeaderKey);

  const init: RequestInit = {
    method: methodType,
    headers: _headers,
  };

  if (body && !isGetMethodType) {
    init.body = JSON.stringify(body);
  }
  const response = await fetch(url, init);

  // Early return for non-2xx status codes
  if (!response.ok) {
    const errorBody = await readDataFromStream(response.body);
    if (response.status >= 400 && response.status < 500) {
      throw new Error(errorBody);
    } else if (response.status >= 500) {
      console.error(errorBody);
      throw new Error(errorBody);
    }
  }

  // Handle no-content responses explicitly
  if (
    response.status === 204 ||
    response.headers.get("Content-Length") === "0"
  ) {
    return null;
  }

  try {
    const jsonResponse = await response.json();

    // SUPABASE ONLY, NEEDS REFACTORING
    const contentRange = response.headers.get("Content-Range");

    if (!contentRange || contentRange.endsWith("/*")) return jsonResponse;

    const pagingModel = extractPagingFromSupabase(contentRange);

    return {
      results: jsonResponse,
      paging: {
        totalRecords: pagingModel.totalRecords,
        recordsPerPage: pagingModel.recordsPerPage,
        page: pagingModel.page,
      },
    };
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null;
  }
}

export const prepareRequestData = (
  action: any,
  endpoint: Endpoint,
  computeValue: any,
) => {
  if (!endpoint) {
    return { url: "", header: {}, body: {} };
  }
  const headerKeys = Object.keys(action.binds?.header ?? {});
  const queryStringKeys = Object.keys(action.binds?.parameter ?? {});
  const bodyKeys = Object.keys(action.binds?.body ?? {});
  const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;

  const computedValues = getVariablesValue(
    merge(
      action.binds?.body ?? {},
      action.binds?.parameter ?? {},
      action.binds?.header ?? {},
    ),
    computeValue,
  );

  const url = getUrl(queryStringKeys, apiUrl, computedValues);
  const header = headerKeys.length
    ? pick<Record<string, string>, string>(computedValues, headerKeys)
    : undefined;

  const body = bodyKeys.length
    ? pick<Record<string, string>, string>(computedValues, bodyKeys)
    : undefined;

  // Commenting out as there is an issue in BETA converting an array as a string. No time to investigate.
  // endpoint.requestBody.forEach((item) => {
  //   if (body && body[item.name] && typeof body[item.name] === "string") {
  //     body[item.name] = safeJsonParse(body[item.name]);
  //   }
  // });

  return { url, header, body };
};

const getVariablesValue = (
  objs: Record<string, ValueProps>,
  computeValue: (props: { value: ValueProps }) => any,
) => {
  return Object.entries(objs).reduce((acc, [key, value]) => {
    const fieldValue = computeValue({ value });

    if (notUndefined(fieldValue)) {
      // @ts-ignore
      acc[key] = fieldValue;
    }
    return acc;
  }, {});
};

export const getUrl = (
  keys: string[],
  apiUrl: string,
  variableValues: Record<string, string>,
) => {
  let updatedUrl = keys.reduce((currentUrl, key) => {
    return currentUrl.replace(`{${key}}`, variableValues[key] || "");
  }, apiUrl);

  const queryParams = keys.filter((key) => !apiUrl.includes(`{${key}}`));

  if (queryParams.length > 0) {
    const urlObject = new URL(updatedUrl);
    queryParams.forEach((key) => {
      const value = variableValues[key];
      if (value) {
        urlObject.searchParams.append(key, value);
      }
    });
    updatedUrl = urlObject.toString();
  }

  return updatedUrl;
};
