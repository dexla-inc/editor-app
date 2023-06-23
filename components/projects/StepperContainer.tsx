import ProjectStepper from "@/components/projects/ProjectStepper";
import StepperContent from "@/components/projects/StepperContent";
import { StepperState } from "@/utils/projectTypes";
import { Stack } from "@mantine/core";

export default function StepperContainer({
  activeStep,
  setActiveStep,
}: StepperState) {
  return (
    <Stack spacing="xl">
      <ProjectStepper activeStep={activeStep} setActiveStep={setActiveStep} />
      <StepperContent activeStep={activeStep} setActiveStep={setActiveStep} />
    </Stack>
  );
}
