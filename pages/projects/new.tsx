import { DashboardShell } from "@/components/DashboardShell";
import BrandingStep from "@/components/projects/BrandingStep";
import PagesStep from "@/components/projects/PagesStep";
import ProjectInfoStep from "@/components/projects/ProjectInfoStep";
import ProjectStep from "@/components/projects/ProjectStep";
import { getPageList } from "@/requests/pages/queries";
import { PageAIResponse, PageResponse } from "@/requests/pages/types";
import { RegionTypes, getProject } from "@/requests/projects/queries";
import { ThemeResponse } from "@/requests/themes/types";
import { useAppStore } from "@/stores/app";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { StepperDetailsType } from "@/utils/projectTypes";
import { Container, Stack, Stepper, Title } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function New() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const activeCompany = usePropelAuthStore((state) => state.activeCompany);

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [screenshots, setScreenshots] = useState<FileWithPath[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [themeResponse, setThemeResponse] = useState<ThemeResponse>();
  const [pages, setPages] = useState<PageAIResponse[]>([]);
  const [hasPagesCreated, setHasPagesCreated] = useState(false);
  const [homePageId, setHomePageId] = useState("");
  const [friendlyName, setFriendlyName] = useState(activeCompany.orgName);
  const [region, setRegion] = useState<RegionTypes>("US_CENTRAL");

  const router = useRouter();
  const company = router.query.company as string;
  const projectIdFromQuery = router.query.projectId;
  const stepFromQuery = router.query.step;

  useEffect(() => {
    if (projectIdFromQuery) {
      setProjectId(projectIdFromQuery as string);

      const fetchProject = async () => {
        const project = await getProject(projectIdFromQuery as string);

        setDescription(project.description);
        setIndustry(project.industry);
        setFriendlyName(project.friendlyName);
        setRegion(project.region.type);
      };

      const fetchPages = async () => {
        const pages = await getPageList(projectIdFromQuery as string);

        const pageAiResult: PageAIResponse[] = pages.results.map(
          (page: PageResponse) => ({
            name: page.title,
            features: page.description?.split(",") || [],
          }),
        );

        setPages(pageAiResult);

        if (stepFromQuery) {
          setActiveStep(parseInt(stepFromQuery as string));
        }
      };

      fetchProject();
      fetchPages();
    }
  }, [projectIdFromQuery, stepFromQuery]);

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
                companyId={company}
                nextStep={nextStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                startLoading={startLoading}
                stopLoading={stopLoading}
                projectId={projectId}
                setProjectId={setProjectId}
                description={description}
                setDescription={setDescription}
                industry={industry}
                setIndustry={setIndustry}
                screenshots={screenshots}
                setScreenshots={setScreenshots}
              />
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
              />
            </Stepper.Step>
            <Stepper.Step label="Pages" description="Generate your page names">
              <PagesStep
                prevStep={prevStep}
                nextStep={nextStep}
                projectId={projectId}
                pages={pages}
                setPages={setPages}
                hasPagesCreated={hasPagesCreated}
                setHasPagesCreated={setHasPagesCreated}
                setHomePageId={setHomePageId}
              />
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
              />
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
