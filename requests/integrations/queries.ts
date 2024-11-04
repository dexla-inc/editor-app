import { buildQueryString } from "@/types/dashboardTypes";
import { get } from "@/utils/api";
import {
  IntegrationAuthenticationResponse,
  IntegrationAuthUrlResponse,
} from "@/requests/integrations/types";

export const generateIntegrationUrl = async (
  connector: string,
  reference?: string,
) => {
  let url = `/integrations/${connector}`;

  url += buildQueryString({ reference });

  const response = (await get<IntegrationAuthUrlResponse>(
    url,
  )) as IntegrationAuthUrlResponse;

  return response;
};

export const callbackIntegration = async (connector: string) => {
  let url = `/integrations/${connector}/callback`;

  const response = (await get<IntegrationAuthenticationResponse>(
    url,
  )) as IntegrationAuthenticationResponse;

  return response;
};
