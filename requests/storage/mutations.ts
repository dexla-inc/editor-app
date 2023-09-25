import { post } from "@/utils/api";

export const uploadFile = async (projectId: string, file: File) => {
  let url = `/projects/${projectId}/storage`;

  const formData = new FormData();
  formData.append("file", file);

  const response = (await post<any>(url, formData)) as any;

  return response;
};
