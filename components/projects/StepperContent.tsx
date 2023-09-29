import BrandingStep from "@/components/projects/BrandingStep";
import PagesStep from "@/components/projects/PagesStep";
import ProjectStep from "@/components/projects/ProjectStep";
import { ThemeResponse } from "@/requests/themes/types";
import { useAppStore } from "@/stores/app";
import { StepperState } from "@/utils/dashboardTypes";

import { Stack } from "@mantine/core";
import { useState } from "react";

export default function StepperContent({
  activeStep,
  setActiveStep,
}: StepperState) {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const nextStep = () =>
    setActiveStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

  const [projectId, setProjectId] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [themeResponse, setThemeResponse] = useState<ThemeResponse>();
  const [initialPageFetchDone, setInitialPageFetchDone] = useState(false);

  return (
    <Stack sx={{ width: "100%" }}>
      {activeStep == 0 && (
        <ProjectStep
          nextStep={nextStep}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          setProjectId={setProjectId}
        ></ProjectStep>
      )}
      {activeStep == 1 && (
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
      )}
      {activeStep == 2 && (
        <PagesStep
          prevStep={prevStep}
          projectId={projectId}
          pages={pages}
          setPages={setPages}
          initialPageFetchDone={initialPageFetchDone}
          setInitialPageFetchDone={setInitialPageFetchDone}
        ></PagesStep>
      )}
    </Stack>
  );
}
