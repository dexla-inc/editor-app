import {
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";
import { FileWithPath } from "@mantine/dropzone";
import { post } from "@/utils/api";

export const uploadFile = async (
  projectId: string,
  file: File | File[] | FileWithPath | FileWithPath[],
  isMultiple: boolean = false,
) => {
  let url = `/projects/${projectId}/storage/internal?isMultiple=${isMultiple}`;

  const formData = new FormData();
  if (Array.isArray(file)) file.forEach((f) => formData.append("file", f));
  else formData.append("file", file);

  const response = (await post<UploadMultipleResponse | UploadResponse>(
    url,
    formData,
  )) as UploadMultipleResponse | UploadResponse;

  // const cacheTag = getCacheTag(projectId);
  // await evictCache(cacheTag);

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

//const getCacheTag = (projectId: string) => `/projects/${projectId}/storage`;
