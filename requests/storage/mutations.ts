import {
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { del, post } from "@/utils/api";
import { FileWithPath } from "@mantine/dropzone";
import { evictCache } from "@/requests/cache/queries-noauth";

export const uploadFile = async (
  projectId: string,
  file: File | File[] | FileWithPath | FileWithPath[],
  isMultiple: boolean = false,
  internal: boolean = false,
) => {
  let url = `/projects/${projectId}/storage?isMultiple=${isMultiple}`;

  const formData = new FormData();
  if (Array.isArray(file)) file.forEach((f) => formData.append("file", f));
  else formData.append("file", file);

  const response = (await post<UploadMultipleResponse | UploadResponse>(
    url,
    formData,
  )) as UploadMultipleResponse | UploadResponse;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

export const deleteFile = async (projectId: string, name: string) => {
  let url = `/projects/${projectId}/storage?name=${name}`;

  const response = (await del<any>(url)) as any;

  const cacheTag = getCacheTag(projectId);
  await evictCache(cacheTag);

  return response;
};

const getCacheTag = (projectId: string) => `/projects/${projectId}/storage`;
