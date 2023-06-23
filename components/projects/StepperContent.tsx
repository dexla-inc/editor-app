import BrandingStep from "@/components/projects/BrandingStep";
import PagesStep from "@/components/projects/PagesStep";
import ProjectStep from "@/components/projects/ProjectStep";
import { useAppStore } from "@/stores/app";
import { StepperState } from "@/utils/projectTypes";
import { Stack } from "@mantine/core";
import { useState } from "react";

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

  const [projectId, setProjectId] = useState("");

  return (
    <Stack sx={{ width: "100%" }}>
      {activeStep == 0 && (
        <ProjectStep
          nextStep={nextStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setProjectId={setProjectId}
        ></ProjectStep>
      )}
      {activeStep == 1 && (
        <BrandingStep
          prevStep={prevStep}
          nextStep={nextStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          projectId={projectId}
        ></BrandingStep>
      )}
      {activeStep == 2 && (
        <PagesStep
          prevStep={prevStep}
          isLoading={isLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          projectId={projectId}
        ></PagesStep>
      )}
    </Stack>
  );
}
