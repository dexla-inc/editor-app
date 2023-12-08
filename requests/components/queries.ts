import { getWithoutAuth } from "@/utils/apiNoAuth";

export type CustomComponentResponse = {
  id: string;
  type: string;
  name: string;
  scope: ComponentScopes;
  content: string;
  description: string;
};

type ComponentScopes = "PROJECT" | "COMPANY" | "GLOBAL";

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
