import { get } from "@/utils/api";

export type CustomComponentResponse = {
  id: string;
  type: string;
  name: string;
  scope: string;
  content: string;
  description: string;
};

type CustomComponentListResponse = {
  results: CustomComponentResponse[];
};

export const getComponentList = async (projectId: string) => {
  const response = (await get<CustomComponentListResponse>(
    `/projects/${projectId}/components`,
    {}
  )) as CustomComponentListResponse;

  return response;
};
