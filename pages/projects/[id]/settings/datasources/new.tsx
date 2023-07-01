import { Shell } from "@/components/AppShell";
import DexlaStepper from "@/components/DexlaStepper";
import StepperContent from "@/components/datasources/StepperContent";
import { StepperStepProps } from "@/utils/dashboardTypes";
import { Container, Stack, Title } from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { useState } from "react";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};

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

  // Refactor so Shell, user, container and Stack are in the parent component
  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <Stack spacing="xl">
          <Title>Data Source Settings</Title>
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
    </Shell>
  );
}
