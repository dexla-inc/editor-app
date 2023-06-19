import { Shell } from "@/components/AppShell";
import { useAppStore } from "@/stores/app";
import { Container, Flex, Stack, Stepper, Title } from "@mantine/core";
import { useState } from "react";
import GenerateAppStep from "./generateAppStep";
import IntegrationsStep from "./integrationsStep";
import PagesStep from "./pagesStep";
import ProjectStep from "./projectStep";
import { LoadingStore, StepperAction, StepperState } from "./projectTypes";

export default function New() {
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Shell>
      <Container py={60}>
        <Stack spacing="xl">
          <Heading activeStep={activeStep}></Heading>
          <StepperContainer
            isLoading={isLoading}
            startLoading={startLoading}
            stopLoading={stopLoading}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          ></StepperContainer>
        </Stack>
      </Container>
    </Shell>
  );
}

const stepperDetails: StepperDetailsType = {
  0: {
    title: "Ready to create something Buck-tacular?",
  },
  1: {
    title: "Here are your pages. It’s Buck-athon time!",
  },
  2: {
    title:
      "The integration station! Let’s connect your data sources like a maestro!",
  },
  3: {
    title: "Ready to be blown away? Because there’s a Buck-storm coming...",
  },
};

type StepperDetailsType = {
  [key: number]: { title: string };
};

function Heading({ activeStep }: { activeStep: number }) {
  const details = stepperDetails[activeStep];

  return (
    <Stack>
      <Title order={2}>{details.title}</Title>
    </Stack>
  );
}

function StepperContainer({
  startLoading,
  stopLoading,
  isLoading,
  activeStep,
  setActiveStep,
}: LoadingStore & {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  return (
    <Flex>
      <ProjectStepper activeStep={activeStep} setActiveStep={setActiveStep} />
      <StepperContent
        nextStep={nextStep}
        prevStep={prevStep}
        activeStep={activeStep}
        isLoading={isLoading}
        startLoading={startLoading}
        stopLoading={stopLoading}
      />
    </Flex>
  );
}

function ProjectStepper({ activeStep, setActiveStep }: StepperAction) {
  return (
    <Stepper
      active={activeStep}
      onStepClick={setActiveStep}
      orientation="vertical"
      px="xl"
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

function StepperContent({
  nextStep,
  prevStep,
  activeStep,
  startLoading,
  stopLoading,
  isLoading,
}: StepperState & LoadingStore & StepperAction) {
  return (
    <Container size="sm">
      <Stack>
        {activeStep == 0 && (
          <ProjectStep
            nextStep={nextStep}
            isLoading={isLoading}
            startLoading={startLoading}
            stopLoading={stopLoading}
          ></ProjectStep>
        )}
        {activeStep == 1 && <PagesStep></PagesStep>}
        {activeStep == 2 && <IntegrationsStep></IntegrationsStep>}
        {activeStep == 3 && <GenerateAppStep></GenerateAppStep>}
      </Stack>
    </Container>
  );
}
