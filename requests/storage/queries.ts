import { getWithoutAuth } from "@/utils/apiNoAuth";

export const getFile = async (projectId: string, name: string) => {
  let url = `/projects/${projectId}/storage?name=${name}`;

  const response = (await getWithoutAuth<any>(url)) as any;

  return response;
};
