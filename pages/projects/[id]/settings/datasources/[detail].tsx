import { Shell } from "@/components/AppShell";
import { useAppStore } from "@/stores/app";
import { StepperStepProps } from "@/utils/dashboardTypes";
import { Container, Stack, Title } from "@mantine/core";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectId = router.query.id as string;
  const [activeStep, setActiveStep] = useState(0);

  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

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
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <Stack spacing="xl">
          <Title>Data Source Details</Title>
        </Stack>
      </Container>
    </Shell>
  );
}
