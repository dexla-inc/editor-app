import { getWithoutAuth } from "@/utils/apiNoAuth";

export const evictCache = async (relativeUrl: string) => {
  let url = `/cache/evict?tag=${relativeUrl}`;

  const response = (await getWithoutAuth<any>(url)) as any;

  return response;
};
