import { Shell } from "@/components/AppShell";
import ProjectStepper from "@/components/projects/ProjectStepper";
import StepperContent from "@/components/projects/StepperContent";
import { StepperDetailsType } from "@/utils/projectTypes";
import { Container, Stack, Title } from "@mantine/core";
import { useState } from "react";

export default function New() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Shell>
      <Container py={60}>
        <Stack spacing="xl">
          <StepperHeading activeStep={activeStep}></StepperHeading>
          <ProjectStepper
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
          <StepperContent
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
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
    title: "Ready to be blown away? Because there’s a Buck-storm coming...",
  },
};

function StepperHeading({ activeStep }: { activeStep: number }) {
  const details = stepperDetails[activeStep];

  return (
    <Stack>
      <Title order={2}>{details.title}</Title>
    </Stack>
  );
}
