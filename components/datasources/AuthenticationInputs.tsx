import { patchDataSource } from "@/requests/datasources/mutations";
import { Endpoint, ExampleResponse } from "@/requests/datasources/types";

type EndpointDropdown = {
  value: string;
  label: string;
  exampleresponse?: ExampleResponse[];
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
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export type ExampleResponseDropdown = {
  value: string;
  label: string;
  type: string;
};

export function mapEndpointExampleResponse(
  exampleResponse: ExampleResponse[] | undefined
): ExampleResponseDropdown[] | undefined {
  return exampleResponse
    ?.map((e) => ({
      value: e.name,
      label: e.name,
      type: e.type,
    }))
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

  const result = mapEndpointExampleResponse(selectedEndpoint?.exampleresponse);
  setExampleResponse(result);
};

// export type AuthenticationInputProps = {
//   form: UseFormReturnType<AuthenticationStepParams>;
//   authenticationScheme?: string;
//   setAuthenticationScheme?: (value: string) => void;
//   loginEndpointId: string | null;
//   setLoginEndpointId: (loginEndpointId: string | null) => void;
// };

// export const AuthenticationInputs = ({
//   form,
//   authenticationScheme,
//   setAuthenticationScheme,
//   loginEndpointId,
//   setLoginEndpointId,
// }: AuthenticationInputProps) => {
//   return (
//     <>
//       {dataSource?.swaggerUrl ? (
//         <>
//           <SearchableSelectComponent
//             label="Login Endpoint (POST)"
//             description="The endpoint used to login to your API"
//             placeholder="/v1/login"
//             value={loginEndpointId}
//             form={form}
//             propertyName="loginEndpointId"
//             data={postEndpoints}
//             setProperty={(value) => setLoginEndpoint(value ?? "")}
//           />
//           <SearchableSelectComponent
//             label="Refresh Endpoint (POST)"
//             description="The endpoint used to refresh your API token"
//             placeholder="/v1/login/refresh"
//             value={refreshEndpointId}
//             form={form}
//             propertyName="refreshEndpointId"
//             data={postEndpoints}
//             setProperty={(value) => setRefreshEndpoint(value ?? "")}
//           />
//           <SearchableSelectComponent
//             label="User Endpoint (GET)"
//             description="The endpoint used to user information"
//             placeholder="/v1/user"
//             value={userEndpointId}
//             form={form}
//             propertyName="userEndpointId"
//             data={getEndpoints}
//             setProperty={(value) => setUserEndpoint(value ?? "")}
//           />
//         </>
//       ) : (
//         <>
//           <TextInputComponent
//             label="Login Endpoint (POST)"
//             description="The endpoint used to login to your API"
//             placeholder="/v1/login"
//             value={loginEndpointId}
//             form={form}
//             propertyName="loginEndpointId"
//             setProperty={(value) => setLoginEndpoint(value ?? "")}
//           />
//           <TextInputComponent
//             label="Refresh Endpoint (POST)"
//             description="The endpoint used to refresh your API token"
//             placeholder="/v1/login/refresh"
//             value={refreshEndpointId}
//             form={form}
//             propertyName="refreshEndpointId"
//             setProperty={(value) => setRefreshEndpoint(value ?? "")}
//           />

//           <TextInputComponent
//             label="User Endpoint (GET)"
//             description="The endpoint used to user information"
//             placeholder="/v1/user"
//             value={userEndpointId}
//             form={form}
//             propertyName="userEndpointId"
//             setProperty={(value) => setUserEndpoint(value ?? "")}
//           />
//         </>
//       )}
//       {dataSource?.swaggerUrl && loginEndpointId ? (
//         <SearchableSelectComponent
//           label="Access token property"
//           description="The property name of the access token in the response"
//           placeholder="access"
//           value={accessToken}
//           form={form}
//           propertyName="accessToken"
//           data={exampleResponse ?? []}
//           setProperty={setAccessToken}
//           nothingFoundText="Not found. Update your swagger to include the response property"
//         />
//       ) : (
//         <TextInputComponent
//           label="Access token property"
//           description="The property name of the access token in the response"
//           placeholder="access"
//           form={form}
//           propertyName="accessToken"
//           value={accessToken}
//           setProperty={setAccessToken}
//           required={!!loginEndpointId}
//         />
//       )}
//       {dataSource?.swaggerUrl && refreshEndpointId ? (
//         <SearchableSelectComponent
//           label="Refresh token property"
//           description="The property name of the refresh token in the response"
//           placeholder="refresh"
//           value={refreshToken}
//           form={form}
//           propertyName="refreshToken"
//           data={exampleResponse ?? []}
//           setProperty={setRefreshToken}
//           nothingFoundText="Not found. Update your swagger to include the response property"
//         />
//       ) : (
//         <TextInputComponent
//           label="Refresh token property"
//           description="The property name of the refresh token in the response"
//           placeholder="refresh"
//           form={form}
//           propertyName="refreshToken"
//           value={refreshToken}
//           setProperty={setRefreshToken}
//           required={!!refreshEndpointId}
//         />
//       )}
//     </>
//   );
// };
