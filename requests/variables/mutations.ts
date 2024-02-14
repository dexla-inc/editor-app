import { SuccessResponse } from "@/requests/types";
import { VariableResponse } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { del, post, put } from "@/utils/api";

const setVariable = useVariableStore.getState().setVariable;
const onDeleteVariable = useVariableStore.getState().deleteVariable;

export const createVariable = async (
  projectId: string,
  params: Omit<VariableResponse, "id">,
) => {
  let url = `/projects/${projectId}/variables`;

  const response = (await post<VariableResponse>(
    url,
    params,
  )) as VariableResponse;

  setVariable({ id: response.id, ...params });
  return response;
};

export const updateVariable = async (
  id: string,
  projectId: string,
  params: Omit<VariableResponse, "id">,
) => {
  let url = `/projects/${projectId}/variables/${id}`;

  const response = (await put<VariableResponse>(
    url,
    params,
  )) as VariableResponse;
  setVariable({ id: response.id, value: params.defaultValue, ...params });

  return response;
};

export const deleteVariable = async (projectId: string, id: string) => {
  let url = `/projects/${projectId}/variables/${id}`;
  onDeleteVariable(id);
  const response = (await del<SuccessResponse>(url)) as SuccessResponse;

  return response;
};
