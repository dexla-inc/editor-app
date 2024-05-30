import DexlaStepper from "@/components/DexlaStepper";
import StepperContent from "@/components/datasources/StepperContent";
import { StepperStepProps } from "@/types/dashboardTypes";
import { Container, Stack, Title } from "@mantine/core";
import { useState } from "react";

type Props = {
  closeModal?: any;
};

export default function DataSourceAddSwagger({ closeModal }: Props) {
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
          closeModal={closeModal}
        ></StepperContent>
      </Stack>
    </Container>
  );
}
