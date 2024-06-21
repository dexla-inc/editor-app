type FetchType = {
  url: string;
  method?: string;
  body?: object;
  headers?: object;
  cache?: RequestCache;
  init?: object;
};

export const baseURL = process.env.NEXT_PUBLIC_APPS_BASE_URL;

async function doFetchWithoutAuth<Type>({
  url,
  method,
  body,
  headers = {},
  cache = "default",
  init = {},
}: FetchType): Promise<Type | null> {
  return new Promise(async (resolve, reject) => {
    let response = null;
    try {
      const isFormData = body instanceof FormData;
      let contentType;
      if (!isFormData) {
        contentType = "application/json";
      }
      response = await fetch(`${baseURL}${url}`, {
        ...init,
        method,
        cache,
        headers: {
          ...(contentType ? { "Content-Type": contentType } : {}),
          ...headers,
        },
        ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
      });

      const json = await response?.json?.();

      if (!response.status.toString().startsWith("20")) {
        reject(json?.message ?? "Something went wrong");
      } else {
        resolve(json);
      }
    } catch (error) {
      console.error({ error });
      reject(error);
    }
  });
}

export async function getWithoutAuth<Type>(
  url: FetchType["url"],
  headers?: object,
  cache?: RequestCache,
  init?: object,
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetchWithoutAuth<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "GET",
    headers,
    cache,
    init,
  });
}

export async function postWithoutAuth<Type>(
  url: FetchType["url"],
  body: FetchType["body"],
  headers?: FetchType["headers"],
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetchWithoutAuth<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "POST",
    body,
    headers,
  });
}
