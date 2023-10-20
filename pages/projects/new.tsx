import { DashboardShell } from "@/components/DashboardShell";
import BrandingStep from "@/components/projects/BrandingStep";
import PagesStep from "@/components/projects/PagesStep";
import ProjectInfoStep from "@/components/projects/ProjectInfoStep";
import ProjectStep from "@/components/projects/ProjectStep";
import { RegionTypes } from "@/requests/projects/queries";
import { ThemeResponse } from "@/requests/themes/types";
import { useAppStore } from "@/stores/app";
import { StepperDetailsType } from "@/utils/projectTypes";
import { Container, Stack, Stepper, Title } from "@mantine/core";
import { useState } from "react";

export default function New() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const [projectId, setProjectId] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [themeResponse, setThemeResponse] = useState<ThemeResponse>();
  const [pages, setPages] = useState<string[]>([]);
  const [initialPageFetchDone, setInitialPageFetchDone] = useState(false);
  const [hasPagesCreated, setHasPagesCreated] = useState(false);
  const [homePageId, setHomePageId] = useState("");
  const [friendlyName, setFriendlyName] = useState("");
  const [region, setRegion] = useState<RegionTypes>("US_CENTRAL");

  return (
    <DashboardShell>
      <Container py={60}>
        <Stack spacing="xl">
          <StepperHeading activeStep={activeStep}></StepperHeading>
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            allowNextStepsSelect={false}
            py="lg"
          >
            <Stepper.Step
              label="Project"
              description="Define your project scope"
            >
              <ProjectStep
                nextStep={nextStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                startLoading={startLoading}
                stopLoading={stopLoading}
                setProjectId={setProjectId}
              ></ProjectStep>
            </Stepper.Step>
            <Stepper.Step label="Branding" description="Personalise your app">
              <BrandingStep
                prevStep={prevStep}
                nextStep={nextStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                startLoading={startLoading}
                stopLoading={stopLoading}
                projectId={projectId}
                websiteUrl={websiteUrl}
                setWebsiteUrl={setWebsiteUrl}
                themeResponse={themeResponse}
                setThemeResponse={setThemeResponse}
              ></BrandingStep>
            </Stepper.Step>
            <Stepper.Step label="Pages" description="Generate your page names">
              <PagesStep
                prevStep={prevStep}
                nextStep={nextStep}
                projectId={projectId}
                pages={pages}
                setPages={setPages}
                initialPageFetchDone={initialPageFetchDone}
                setInitialPageFetchDone={setInitialPageFetchDone}
                hasPagesCreated={hasPagesCreated}
                setHasPagesCreated={setHasPagesCreated}
                setHomePageId={setHomePageId}
              ></PagesStep>
            </Stepper.Step>
            <Stepper.Completed>
              <ProjectInfoStep
                prevStep={prevStep}
                projectId={projectId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                startLoading={startLoading}
                stopLoading={stopLoading}
                homePageId={homePageId}
                friendlyName={friendlyName}
                setFriendlyName={setFriendlyName}
                region={region}
                setRegion={setRegion}
              ></ProjectInfoStep>
            </Stepper.Completed>
          </Stepper>
        </Stack>
      </Container>
    </DashboardShell>
  );
}

const stepperDetails: StepperDetailsType = {
  0: {
    title: "Ready to create something Buck-tacular?",
  },
  1: {
    title: "Grab your Buck-ets, it's time to paint your brand!",
  },
  2: {
    title: "Here are your pages. It’s Buck-athon time!",
  },
  3: {
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
