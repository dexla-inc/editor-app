import { PatchParams, SuccessResponse } from "@/requests/types";
import { VariableParams, VariableResponse } from "@/requests/variables/types";
import { del, patch, post, put } from "@/utils/api";

export const createVariable = async (
  projectId: string,
  params: VariableParams,
) => {
  let url = `/projects/${projectId}/variables`;

  const response = (await post<VariableResponse>(
    url,
    params,
  )) as VariableResponse;

  return response;
};

export const updateVariable = async (
  projectId: string,
  id: string,
  params: VariableParams,
) => {
  let url = `/projects/${projectId}/variables/${id}`;

  const response = (await put<VariableResponse>(
    url,
    params,
  )) as VariableResponse;

  return response;
};

export const patchVariable = async (
  projectId: string,
  id: string,
  params: PatchParams[],
) => {
  let url = `/projects/${projectId}/variables/${id}`;

  const response = (await patch<VariableResponse>(
    url,
    params,
  )) as VariableResponse;

  return response;
};

export const deleteVariable = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/variables/${id}`;

  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
