import {
  UploadMultipleResponse,
  UploadResponse,
} from "@/requests/storage/types";
import { post } from "@/utils/api";

export const uploadFile = async (
  projectId: string,
  file: File | File[],
  isMultiple: boolean = false,
) => {
  let url = `/projects/${projectId}/storage?isMultiple=${isMultiple}`;

  const formData = new FormData();
  if (Array.isArray(file)) file.forEach((f) => formData.append("file", f));
  else formData.append("file", file);

  const response = (await post<UploadMultipleResponse | UploadResponse>(
    url,
    formData,
  )) as UploadMultipleResponse | UploadResponse;

  return response;
};
