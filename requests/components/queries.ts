import { CustomComponentResponse } from "@/requests/components/types";
import { getWithoutAuth } from "@/utils/apiNoAuth";

type CustomComponentListResponse = {
  results: CustomComponentResponse[];
};

export const getComponentList = async (
  projectId: string,
  companyId: string,
) => {
  const response = (await getWithoutAuth<CustomComponentListResponse>(
    `/projects/${projectId}/components?companyId=${companyId}`,
    {},
  )) as CustomComponentListResponse;

  return response;
};
