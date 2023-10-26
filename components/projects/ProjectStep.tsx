import { InformationAlert } from "@/components/Alerts";
import NextButton from "@/components/NextButton";
import ScreenshotUploader from "@/components/projects/ScreenshotUploader";
import {
  ProjectParams,
  createEntitiesAndProject,
  patchProject,
} from "@/requests/projects/mutations";
import { uploadFile } from "@/requests/storage/mutations";
import { UploadMultipleResponse } from "@/requests/storage/types";
import { PatchParams } from "@/requests/types";
import { LoadingStore, NextStepperClickEvent } from "@/utils/dashboardTypes";
import { ProjectTypes } from "@/utils/projectTypes";
import { Divider, Flex, Group, Stack, TextInput } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { Dispatch, SetStateAction } from "react";

interface ProjectStepProps extends LoadingStore, NextStepperClickEvent {
  companyId: string;
  projectId: string;
  setProjectId: (id: string) => void;
  screenshots: FileWithPath[];
  setScreenshots: Dispatch<SetStateAction<FileWithPath[]>>;
}

export default function ProjectStep({
  companyId,
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  projectId,
  setProjectId,
  screenshots,
  setScreenshots,
}: ProjectStepProps) {
  const form = useForm<ProjectParams>({
    initialValues: {
      companyId: companyId,
      description: "",
      region: "US_CENTRAL",
      type: "" as ProjectTypes,
      industry: "",
      friendlyName: "",
      similarCompany: undefined,
    },
    validate: {
      description: (value) =>
        value === ""
          ? "You must provide a description"
          : value.length > 250
          ? "Description too long"
          : value.length < 15
          ? "Description too short"
          : null,
    },
  });

  const onSubmit = async (values: ProjectParams) => {
    try {
      setIsLoading && setIsLoading(true);
      startLoading({
        id: "creating-project",
        title: "Creating Project",
        message: "Wait while your project is being created",
      });

      form.validate();

      let project = await createEntitiesAndProject(values);

      if (!project || !project.id) throw new Error("Project not created");

      setProjectId(project.id);

      projectId = project.id;

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

        project = await patchProject(projectId, patchParams);
      }

      stopLoading({
        id: "creating-project",
        title: "Project Created",
        message: "The project was created successfully",
      });
      setIsLoading && setIsLoading(false);
      nextStep();
    } catch (error) {
      stopLoading({
        id: "creating-project",
        title: "Project Failed",
        message: "Validation failed",
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xl">
        <InformationAlert
          title="Let's get started!"
          text="Unlock the magic of AI! Answer a few questions and we'll tailor a unique experience just for you!"
        />
        <TextInput
          label="What do you do? *"
          description="Your one-liner e.g. Transforming Drone and Satellite Data into Actionable Business Insights"
          required
          withAsterisk={false}
          {...form.getInputProps("description")}
        />

        {form.values.type === "SIMILAR" && (
          <Flex direction="column">
            <TextInput
              label="Similar Company Name *"
              placeholder="e.g. ABC Company"
              {...form.getInputProps("similarCompany")}
            />
          </Flex>
        )}

        <TextInput
          label="What industry are you in? *"
          description="e.g. Big Data"
          {...form.getInputProps("industry")}
        />

        <ScreenshotUploader
          screenshots={screenshots}
          setScreenshots={setScreenshots}
        ></ScreenshotUploader>

        <Divider></Divider>
        <Group position="right">
          <NextButton isLoading={isLoading} isSubmit></NextButton>
        </Group>
      </Stack>
    </form>
  );
}
