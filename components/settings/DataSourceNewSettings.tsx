import DexlaStepper from "@/components/DexlaStepper";
import StepperContent from "@/components/datasources/StepperContent";
import { StepperStepProps } from "@/utils/dashboardTypes";
import { Container, Stack, Title } from "@mantine/core";
import { useState } from "react";

export default function DataSourceNewSettings() {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const stepLabels: StepperStepProps[] = [
    {
      label: "Swagger",
      description: "API definition",
    },
    {
      label: "Basic Details",
      description: "API information",
    },
    {
      label: "Authentication",
      description: "Setup authentication",
    },
    {
      label: "Endpoints",
      description: "Confirm endpoints",
    },
  ];

  return (
    <Container py="xl">
      <Stack spacing="xl">
        <Title order={2}>Data Source Settings</Title>
        <DexlaStepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          details={stepLabels}
        />
        <StepperContent
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          nextStep={nextStep}
          prevStep={prevStep}
        ></StepperContent>
      </Stack>
    </Container>
  );
}
