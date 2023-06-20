import GenerateAppStep from "@/components/projects/GenerateAppStep";
import IntegrationsStep from "@/components/projects/IntegrationsStep";
import PagesStep from "@/components/projects/PagesStep";
import ProjectStep from "@/components/projects/ProjectStep";
import { useAppStore } from "@/stores/app";

import { StepperState } from "@/utils/projectTypes";
import { Stack } from "@mantine/core";

export default function StepperContent({
  activeStep,
  setActiveStep,
}: StepperState) {
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  return (
    <Stack sx={{ width: "100%" }}>
      {activeStep == 0 && (
        <ProjectStep
          nextStep={nextStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
        ></ProjectStep>
      )}
      {activeStep == 1 && (
        <PagesStep
          prevStep={prevStep}
          nextStep={nextStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          projectId="918cb31e37594928ac11515fe9f392f4"
        ></PagesStep>
      )}
      {activeStep == 2 && <IntegrationsStep></IntegrationsStep>}
      {activeStep == 3 && <GenerateAppStep></GenerateAppStep>}
    </Stack>
  );
}
