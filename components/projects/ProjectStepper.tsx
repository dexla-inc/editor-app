import { StepperState } from "@/utils/dashboardTypes";
import { Stepper } from "@mantine/core";

export default function ProjectStepper({
  activeStep,
  setActiveStep,
}: StepperState) {
  return (
    <Stepper
      active={activeStep}
      onStepClick={setActiveStep}
      allowNextStepsSelect={false}
      py="lg"
    >
      <Stepper.Step label="Project" description="Define your project scope" />
      <Stepper.Step label="Branding" description="Personalise your app" />
      <Stepper.Step label="Pages" description="Generate your page names" />
    </Stepper>
  );
}
