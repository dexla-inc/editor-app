import { SuccessResponse } from "@/requests/types";
import { VariableParams, VariableResponse } from "@/requests/variables/types";
import { useVariableStore } from "@/stores/variables";
import { del, post } from "@/utils/api";

export const createVariable = async (
  projectId: string,
  params: VariableParams,
) => {
  let url = `/projects/${projectId}/variables`;
  const setVariable = useVariableStore.getState().setVariable;
  setVariable(params);

  const response = (await post<VariableResponse>(
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
