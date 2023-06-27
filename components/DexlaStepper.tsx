import { DexlaStepperProps } from "@/utils/dashboardTypes";
import { Stepper } from "@mantine/core";

export default function DexlaStepper({
  activeStep,
  setActiveStep,
  details,
}: DexlaStepperProps) {
  return (
    <Stepper
      active={activeStep}
      onStepClick={setActiveStep}
      allowNextStepsSelect={false}
      py="lg"
      sx={{
        width: "100%",
      }}
    >
      {details.map((step, index) => (
        <Stepper.Step
          key={index}
          label={step.label}
          description={step.description}
        />
      ))}
    </Stepper>
  );
}
