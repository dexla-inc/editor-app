import { patchDataSource } from "@/requests/datasources/mutations";
import { Endpoint, RequestBody } from "@/requests/datasources/types";

type EndpointDropdown = {
  value: string;
  label: string;
  exampleresponse?: string;
  requestbody?: RequestBody[];
}[];

export function filterAndMapEndpoints(
  endpoints: Array<Endpoint> | undefined,
  methodType: string
): EndpointDropdown {
  if (!endpoints) {
    return [];
  }
  return endpoints
    .filter((endpoint) => endpoint.methodType === methodType)
    .map((endpoint) => ({
      value: endpoint.id,
      label: endpoint.relativeUrl,
      exampleresponse: endpoint.exampleResponse,
      requestbody: endpoint.requestBody,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export type ExampleResponseDropdown = {
  value: string;
  label: string;
  type: string;
};

export function mapEndpointExampleResponse(
  exampleJsonResponse: string
): ExampleResponseDropdown[] | undefined {
  const exampleJson = JSON.parse(exampleJsonResponse);

  const keys = Object.keys(exampleJson);
  return keys
    .map((e) => ({
      value: e,
      label: e,
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label)
    ) as ExampleResponseDropdown[];
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
  dataSourceId: string,
  endpointId: string,
  endpointType: string,
  token?: string | undefined,
  secondaryToken?: string | undefined
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

  if (secondaryToken) {
    patchParams.push({
      op: "replace",
      path: "/authentication/tokenSecondaryKey",
      value: secondaryToken,
    });
  }

  await patchDataSource(projectId, dataSourceId, endpointId, patchParams);
}

type EndpointSetter = (value: string | null) => void;

export const setEndpoint = (
  setEndpointId: EndpointSetter,
  endpoint: { value: string; label: string } | undefined,
  value: string | null,
  setEndpointLabel?: EndpointSetter
) => {
  setEndpointId(value);
  setEndpointLabel && setEndpointLabel(endpoint?.label as string);
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
  expiryProperty?: string | undefined;
};

export const setExampleResponseObject = (
  postEndpoints: EndpointDropdown,
  setExampleResponse: (
    exampleResponse: ExampleResponseDropdown[] | undefined
  ) => void,
  value: string | undefined
) => {
  const selectedEndpoint = postEndpoints.find(
    (option) => option.value === value
  );

  if (selectedEndpoint?.exampleresponse) {
    const result = mapEndpointExampleResponse(
      selectedEndpoint?.exampleresponse
    );
    setExampleResponse(result);
  }
};

export const setRequestBodyObject = (
  postEndpoints: EndpointDropdown,
  setRequestBody: (requestBody: RequestBody[] | undefined) => void,
  value: string | undefined
) => {
  const selectedEndpoint = postEndpoints.find(
    (option) => option.value === value
  );

  if (selectedEndpoint?.requestbody) {
    setRequestBody(selectedEndpoint?.requestbody);
  }
};
