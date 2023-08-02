import { ExampleResponseDropdown } from "@/components/datasources/AuthenticationInputs";
import AuthenticationStep from "@/components/datasources/AuthenticationStep";
import BasicDetailsStep from "@/components/datasources/BasicDetailsStep";
import EndpointsStep from "@/components/datasources/EndpointsStep";
import SwaggerStep from "@/components/datasources/SwaggerStep";
import { DataSourceResponse, Endpoint } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import {
  NextStepperClickEvent,
  PreviousStepperClickEvent,
  StepperState,
} from "@/utils/dashboardTypes";
import { Stack } from "@mantine/core";
import { useState } from "react";

interface StepperContentProps
  extends StepperState,
    NextStepperClickEvent,
    PreviousStepperClickEvent {}

export default function StepperContent({
  activeStep,
  setActiveStep,
  prevStep,
  nextStep,
}: StepperContentProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [dataSource, setDataSource] = useState<DataSourceResponse>(
    {} as DataSourceResponse
  );
  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined
  );
  const [loginEndpointId, setLoginEndpointId] = useState<string | null>(null);
  const [loginEndpointLabel, setLoginEndpointLabel] = useState<string | null>(
    null
  );
  const [refreshEndpointLabel, setRefreshEndpointLabel] = useState<
    string | null
  >(null);
  const [userEndpointLabel, setUserEndpointLabel] = useState<string | null>(
    null
  );
  const [refreshEndpointId, setRefreshEndpointId] = useState<string | null>(
    null
  );

  const [userEndpointId, setUserEndpointId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiryProperty, setExpiryProperty] = useState<string | null>(null);
  const [exampleResponse, setExampleResponse] = useState<
    ExampleResponseDropdown[] | undefined
  >(undefined);

  return (
    <Stack sx={{ width: "100%" }}>
      {activeStep == 0 && (
        <SwaggerStep
          nextStep={nextStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          setDataSource={setDataSource}
          setEndpoints={setEndpoints}
        ></SwaggerStep>
      )}
      {activeStep == 1 && (
        <BasicDetailsStep
          prevStep={prevStep}
          nextStep={nextStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          setDataSource={setDataSource}
        ></BasicDetailsStep>
      )}
      {activeStep == 2 && (
        <AuthenticationStep
          prevStep={prevStep}
          nextStep={nextStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          setDataSource={setDataSource}
          endpoints={endpoints}
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
          exampleResponse={exampleResponse}
          setExampleResponse={setExampleResponse}
          expiryProperty={expiryProperty}
          setExpiryProperty={setExpiryProperty}
        ></AuthenticationStep>
      )}
      {activeStep == 3 && (
        <EndpointsStep
          prevStep={prevStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          setDataSource={setDataSource}
          accessToken={accessToken}
          refreshToken={refreshToken}
          loginEndpointLabel={loginEndpointLabel}
          refreshEndpointLabel={refreshEndpointLabel}
          userEndpointLabel={userEndpointLabel}
          expiryProperty={expiryProperty}
        ></EndpointsStep>
      )}
    </Stack>
  );
}
