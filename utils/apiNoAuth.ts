type FetchType = {
  url: string;
  method?: string;
  body?: object;
  headers?: object;
};

export const baseURL = process.env.NEXT_APPS_BASE_URL;

async function doFetchWithoutAuth<Type>({
  url,
  method,
  body,
  headers = {},
}: FetchType): Promise<Type | null> {
  return new Promise(async (resolve, reject) => {
    let response = null;
    try {
      response = await fetch(`${baseURL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

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

export async function getWithoutAuth<Type>(
  url: FetchType["url"],
  headers?: object,
): Promise<Type | ReadableStream<Uint8Array> | null> {
  return doFetchWithoutAuth<Type | ReadableStream<Uint8Array> | null>({
    url,
    method: "GET",
    headers,
  });
}
