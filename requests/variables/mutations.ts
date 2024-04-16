import { SuccessResponse } from "@/requests/types";
import { VariableResponse } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { del, post, put } from "@/utils/api";
import { evictCache } from "@/requests/cache/queries-noauth";

const setVariable = useVariableStore.getState().setVariable;
const deleteVariableFromStore = useVariableStore.getState().deleteVariable;

export const createVariable = async (
  projectId: string,
  params: Omit<VariableResponse, "id">,
) => {
  const url = `/projects/${projectId}/variables`;

  const response = (await post<VariableResponse>(
    url,
    params,
  )) as VariableResponse;

  setVariable({ id: response.id, ...params });
  await evictCache(url);
  return response;
};

export const updateVariable = async (
  id: string,
  projectId: string,
  params: Omit<VariableResponse, "id">,
) => {
  const cacheTag = `/projects/${projectId}/variables`;
  const url = `${cacheTag}/${id}`;

  const response = (await put<VariableResponse>(
    url,
    params,
  )) as VariableResponse;

  setVariable({ id: response.id, value: params.defaultValue, ...params });

  await evictCache(cacheTag);

  return response;
};

export const deleteVariable = async (projectId: string, id: string) => {
  const cacheTag = `/projects/${projectId}/variables`;
  const url = `${cacheTag}/${id}`;

  deleteVariableFromStore(id);
  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  await evictCache(url);
  return response;
};
