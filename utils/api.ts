import { PatchParams } from "@/requests/types";
import { createClient } from "@propelauth/javascript";

const authClient = createClient({
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
  enableBackgroundTokenRefresh: true,
});

type FetchType = {
  url: string;
  method?: string;
  body?: object;
  headers?: object;
  isStream?: boolean;
};

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAuthToken() {
  const authInfo = await authClient.getAuthenticationInfoOrNull();
  return authInfo?.accessToken;
}

async function doFetch<Type>({
  url,
  method,
  body,
  headers = {},
  isStream,
}: FetchType): Promise<Type | ReadableStream<Uint8Array> | null> {
  return new Promise(async (resolve, reject) => {
    let response = null;
    try {
      const authInfo = await authClient.getAuthenticationInfoOrNull();

      response = await fetch(`${baseURL}${url}`, {
        method,
        headers: {
          ...(isStream
            ? { "Content-Type": "application/octet-stream" }
            : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${authInfo?.accessToken}`,
          ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (isStream) {
        if (!response.status.toString().startsWith("20")) {
          return reject(response.statusText);
        } else {
          return resolve(response.body);
        }
      }

      const json = await response?.json?.();

      if (!response.status.toString().startsWith("20")) {
        reject(json?.message ?? "Something went wrong");
      } else {
        resolve(json);
      }
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
}

export async function get<Type>(
  url: FetchType["url"],
  headers?: object,
  isStream?: boolean
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetch<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "GET",
    headers,
    isStream,
  });
}

export async function put<Type>(
  url: FetchType["url"],
  body: FetchType["body"],
  isStream?: boolean
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetch<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "PUT",
    body,
    isStream,
  });
}

export async function post<Type>(
  url: FetchType["url"],
  body: FetchType["body"],
  isStream?: boolean
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetch<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "POST",
    body,
    isStream,
  });
}

export async function del<Type>(
  url: FetchType["url"],
  isStream?: boolean
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetch<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "DELETE",
    isStream,
  });
}

export async function patch<Type>(
  url: FetchType["url"],
  body: PatchParams[],
  isStream?: boolean
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetch<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "PATCH",
    body,
    isStream,
  });
}
