import { patchDataSource } from "@/requests/datasources/mutations";
import { Endpoint } from "@/requests/datasources/types";

export function filterAndMapEndpoints(
  endpoints: Array<Endpoint> | undefined,
  methodType: string
) {
  if (!endpoints) {
    return [];
  }
  return endpoints
    .filter((endpoint) => endpoint.methodType === methodType)
    .map((endpoint) => ({ value: endpoint.id, label: endpoint.relativeUrl }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function validateTokenProperty(
  name: string,
  value: string | undefined,
  relatedId: string | undefined
) {
  return relatedId && !value ? `${name} token property is required` : null;
}

export async function patchDataSourceWithParams(
  projectId: string,
  type: string,
  dataSourceId: string,
  endpointId: string,
  token: string | null,
  endpointType: string
) {
  const patchParams = [
    {
      op: "replace",
      path: "/authentication/endpointType",
      value: endpointType,
    },
  ];

  if (token) {
    patchParams.push({
      op: "replace",
      path: "/authentication/tokenKey",
      value: token,
    });
  }

  await patchDataSource(projectId, type, dataSourceId, endpointId, patchParams);
}

type EndpointSetter = (value: string | null) => void;

export const setEndpoint = (
  setEndpointId: EndpointSetter,
  endpoints: { value: string; label: string }[],
  value: string | null,
  setEndpointLabel?: EndpointSetter
) => {
  setEndpointId(value);
  const selectedOption = endpoints.find(
    (option) => option.value === value
  )?.label;
  setEndpointLabel && setEndpointLabel(selectedOption as string);
};

export const getAuthEndpoint = (
  endpointType: string,
  endpoints: Endpoint[] | undefined
) => {
  return endpoints?.find((d) => d.authentication.endpointType === endpointType);
};

export type AuthenticationStepParams = {
  loginEndpointId?: string | undefined;
  refreshEndpointId?: string | undefined;
  userEndpointId?: string | undefined;
  accessToken?: string | undefined;
  refreshToken?: string | undefined;
};
