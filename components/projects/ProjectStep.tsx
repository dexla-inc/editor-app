import NextButton from "@/components/NextButton";
import ScreenshotUploader from "@/components/projects/ScreenshotUploader";
import {
  createEntities,
  createProject,
  patchProject,
} from "@/requests/projects/mutations";
import { ProjectParams } from "@/requests/projects/types";
import { uploadFile } from "@/requests/storage/mutations";
import { UploadMultipleResponse } from "@/requests/storage/types";
import { PatchParams } from "@/requests/types";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { LoadingStore, NextStepperClickEvent } from "@/utils/dashboardTypes";
import { ProjectTypes } from "@/utils/projectTypes";
import { Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";

interface ProjectStepProps extends LoadingStore, NextStepperClickEvent {
  companyId: string;
  projectId: string;
  projectCreated: boolean;
  setProjectCreated: (value: boolean) => void;
  description: string;
  setDescription: (description: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  screenshots: File[];
  setScreenshots: Dispatch<SetStateAction<File[]>>;
}

export default function ProjectStep({
  companyId,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  projectId,
  projectCreated,
  setProjectCreated,
  description,
  setDescription,
  industry,
  setIndustry,
  screenshots,
  setScreenshots,
}: ProjectStepProps) {
  const isDexlaAdmin = usePropelAuthStore((state) => state.isDexlaAdmin);

  const form = useForm<ProjectParams>({
    initialValues: {
      id: projectId,
      companyId: companyId,
      description: "",
      region: "US_CENTRAL",
      type: "" as ProjectTypes,
      industry: "",
      friendlyName: "",
      similarCompany: undefined,
    },
    // validate: {
    //   description: (value) =>
    //     value === ""
    //       ? "You must provide a description"
    //       : value.length > 250
    //       ? "Description too long"
    //       : value.length < 15
    //       ? "Description too short"
    //       : null,
    // },
  });

  const onSubmit = async (values: ProjectParams) => {
    try {
      setIsLoading && setIsLoading(true);
      startLoading({
        id: "creating-project",
        title: "AI is thinking...",
        message:
          "Thinking about your app, this step usually takes around 20 seconds...",
      });
      form.validate();

      if (!projectCreated) {
        const project = await createProject(values);

        if (!project) throw new Error("Project not created");
        setProjectCreated(true);

        await createEntities(values);
      }

      if (screenshots.length > 0) {
        const storedScreenshots = (await uploadFile(
          projectId,
          screenshots,
          true,
        )) as UploadMultipleResponse;

        const urls = storedScreenshots.files.map((file) => file.url);

        const patchParams = [
          {
            op: "replace",
            path: "/screenshots",
            value: urls,
          },
        ] as PatchParams[];

        await patchProject(projectId, patchParams);
      }

      stopLoading({
        id: "creating-project",
        title: "Thinking complete!",
        message: "I have an idea of what your app should look like.",
      });

      setIsLoading && setIsLoading(false);
      nextStep();
    } catch (error: any) {
      stopLoading({
        id: "creating-project",
        title: "Project Failed",
        message: error.message,
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing={40} my={25}>
        {/* <InformationAlert
          title="Let's get started!"
          text="Unlock the magic of AI! Answer a few questions and we'll tailor a unique experience just for you!"
        /> */}
        <TextInput
          label="What do you do?"
          description={
            isDexlaAdmin
              ? "e.g. Transform Drone and Satellite Data into Actionable Business Insights"
              : undefined
          }
          placeholder="e.g. Transform Drone and Satellite Data into Actionable Business Insights"
          required
          value={description}
          onChange={(event) => {
            form.setFieldValue("description", event.currentTarget.value);
            setDescription(event.currentTarget.value);
          }}
        />
        {description && (
          <>
            <TextInput
              label="What industry are you in?"
              description="e.g. Big Data"
              placeholder={isDexlaAdmin ? "e.g. Big Data" : undefined}
              value={industry}
              onChange={(event) => {
                form.setFieldValue("industry", event.currentTarget.value);
                setIndustry(event.currentTarget.value);
              }}
            />

            <ScreenshotUploader
              screenshots={screenshots}
              setScreenshots={setScreenshots}
            ></ScreenshotUploader>
          </>
        )}
        <Group position="right">
          <NextButton isLoading={isLoading} isSubmit></NextButton>
        </Group>
      </Stack>
    </form>
  );
}
