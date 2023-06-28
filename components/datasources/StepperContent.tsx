import AuthenticationStep from "@/components/datasources/AuthenticationStep";
import BasicDetailsStep from "@/components/datasources/BasicDetailsStep";
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
  const [dataSource, setDataSource] = useState<DataSourceResponse>();
  const [endpoints, setEndpoints] = useState<Array<Endpoint> | undefined>(
    undefined
  );

  return (
    <Stack sx={{ width: "100%" }}>
      {activeStep == 0 && (
        <SwaggerStep
          nextStep={nextStep}
          isLoading={isLoading}
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
          startLoading={startLoading}
          stopLoading={stopLoading}
          dataSource={dataSource}
          setDataSource={setDataSource}
          endpoints={endpoints}
        ></AuthenticationStep>
      )}
    </Stack>
  );
}
