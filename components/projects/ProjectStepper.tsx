import { StepperState } from "@/utils/projectTypes";
import { Stepper } from "@mantine/core";

export default function ProjectStepper({
  activeStep,
  setActiveStep,
}: StepperState) {
  return (
    <Stepper
      active={activeStep}
      onStepClick={setActiveStep}
      orientation="vertical"
    >
      <Stepper.Step label="Project" description="Describe your project" />
      <Stepper.Step label="Pages" description="Generate your page names" />
      <Stepper.Step
        label="Integrations"
        description="Add third-party plugins"
      />
      <Stepper.Step label="Generate" description="Get ready to see your app" />
    </Stepper>
  );
}
