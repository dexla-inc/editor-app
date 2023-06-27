import BasicDetailsStep from "@/components/datasources/BasicDetailsStep";
import SwaggerStep from "@/components/datasources/SwaggerStep";
import { DataSourceResponse } from "@/requests/datasources/types";
import { useAppStore } from "@/stores/app";
import { StepperState } from "@/utils/dashboardTypes";
import { Stack } from "@mantine/core";
import { useEffect, useState } from "react";

export default function StepperContent({
  activeStep,
  setActiveStep,
}: StepperState) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [dataSource, setDataSource] = useState<DataSourceResponse>();

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  useEffect(() => {
    console.log(dataSource);
  }, [dataSource]);

  return (
    <Stack sx={{ width: "100%" }}>
      {activeStep == 0 && (
        <SwaggerStep
          nextStep={nextStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setDataSource={setDataSource}
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
    </Stack>
  );
}
