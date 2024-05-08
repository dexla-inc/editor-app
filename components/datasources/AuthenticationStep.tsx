import AuthenticationApiKey from "@/components/datasources/AuthenticationApiKey";
import AuthenticationBearer from "@/components/datasources/AuthenticationBearer";
import { ExampleResponseDropdown } from "@/components/datasources/AuthenticationInputs";
import { RequestBody } from "@/requests/datasources/types";
import { DataSourceStepperProps } from "@/types/dashboardTypes";
import { Stack } from "@mantine/core";

interface AuthenticationStepProps extends DataSourceStepperProps {
  loginEndpointId: string | null;
  setLoginEndpointId: (loginEndpointId: string | null) => void;
  refreshEndpointId: string | null;
  setRefreshEndpointId: (refreshEndpointId: string | null) => void;
  userEndpointId: string | null;
  setUserEndpointId: (userEndpointId: string | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
  setLoginEndpointLabel: (loginEndpointLabel: string | null) => void;
  setRefreshEndpointLabel: (refreshEndpointLabel: string | null) => void;
  setUserEndpointLabel: (userEndpointLabel: string | null) => void;
  exampleResponse: ExampleResponseDropdown[] | undefined;
  setExampleResponse: (
    exampleResponse: ExampleResponseDropdown[] | undefined,
  ) => void;
  expiryProperty: string | null;
  setExpiryProperty: (expiryProperty: string | null) => void;
  setLoginRequestBody: (requestBody: RequestBody[] | undefined) => void;
  authenticationScheme?: string | null;
}

export default function AuthenticationStep({
  prevStep,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  dataSource,
  loginEndpointId,
  setLoginEndpointId,
  setLoginEndpointLabel,
  setRefreshEndpointLabel,
  setUserEndpointLabel,
  refreshEndpointId,
  setRefreshEndpointId,
  userEndpointId,
  setUserEndpointId,
  accessToken,
  setAccessToken,
  refreshToken,
  setRefreshToken,
  setExampleResponse,
  exampleResponse,
  expiryProperty,
  setExpiryProperty,
  setLoginRequestBody,
  authenticationScheme,
}: AuthenticationStepProps) {
  return (
    <Stack>
      {authenticationScheme === "BEARER" && (
        <AuthenticationBearer
          prevStep={prevStep}
          nextStep={nextStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          loginEndpointId={loginEndpointId}
          setLoginEndpointId={setLoginEndpointId}
          setLoginEndpointLabel={setLoginEndpointLabel}
          setRefreshEndpointLabel={setRefreshEndpointLabel}
          setUserEndpointLabel={setUserEndpointLabel}
          refreshEndpointId={refreshEndpointId}
          setRefreshEndpointId={setRefreshEndpointId}
          userEndpointId={userEndpointId}
          setUserEndpointId={setUserEndpointId}
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          refreshToken={refreshToken}
          setRefreshToken={setRefreshToken}
          setExampleResponse={setExampleResponse}
          exampleResponse={exampleResponse}
          expiryProperty={expiryProperty}
          setExpiryProperty={setExpiryProperty}
          setLoginRequestBody={setLoginRequestBody}
        />
      )}

      {authenticationScheme === "API_KEY" && (
        <AuthenticationApiKey
          prevStep={prevStep}
          nextStep={nextStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          setAccessToken={setAccessToken}
        />
      )}
    </Stack>
  );
}
