import {
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { getWithoutAuth, postWithoutAuth } from "@/utils/apiNoAuth";
import { FileWithPath } from "@mantine/dropzone";

export const uploadFile = async (
  projectId: string,
  file: File | File[] | FileWithPath | FileWithPath[],
  isMultiple: boolean = false,
  internal: boolean = false,
) => {
  let url = `/projects/${projectId}/storage/internal?isMultiple=${isMultiple}`;

  const formData = new FormData();
  if (Array.isArray(file)) file.forEach((f) => formData.append("file", f));
  else formData.append("file", file);

  const response = (await postWithoutAuth<
    UploadMultipleResponse | UploadResponse
  >(url, formData, { "Content-Type": "multipart/form-data" })) as
    | UploadMultipleResponse
    | UploadResponse;

  return response;
};

export const getFile = async (projectId: string, name: string) => {
  let url = `/projects/${projectId}/storage?name=${name}?jsonReturnType=true`;

  const response = (await getWithoutAuth<any>(url)) as any;

  return response;
};

export const getAllFiles = async (projectId: string) => {
  let url = `/projects/${projectId}/storage`;

  const response = (await getWithoutAuth<UploadMultipleResponse>(url)) as any;

  return response;
};
