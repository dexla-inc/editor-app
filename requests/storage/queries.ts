import { getWithoutAuth } from "@/utils/apiNoAuth";

export const getFile = async (projectId: string, name: string) => {
  let url = `/projects/${projectId}/storage?name=${name}?jsonReturnType=true`;

  const response = (await getWithoutAuth<any>(url)) as any;

  return response;
};

export const getAllFiles = async (projectId: string) => {
  let url = `/projects/${projectId}/storage`;

  const response = (await getWithoutAuth<any>(url)) as any;

  return response;
};
