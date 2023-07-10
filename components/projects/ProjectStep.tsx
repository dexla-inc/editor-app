import { InformationAlert } from "@/components/Alerts";
import NextButton from "@/components/NextButton";
import { ProjectParams, createProject } from "@/requests/projects/mutations";
import { LoadingStore, NextStepperClickEvent } from "@/utils/dashboardTypes";
import { ProjectTypes } from "@/utils/projectTypes";
import { Divider, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface ProjectStepProps extends LoadingStore, NextStepperClickEvent {
  setProjectId: (id: string) => void;
}

export default function ProjectStep({
  nextStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  setProjectId,
}: ProjectStepProps) {
  const form = useForm({
    initialValues: {
      description: "",
      region: "",
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

      const project = await createProject(values);

      setProjectId(project.id);

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
          description="Your one-liner e.g. A universal API that connects all systems that small business customers use with a single integration."
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
          description="e.g. FinTech"
          {...form.getInputProps("industry")}
        />

        <Divider></Divider>
        <Group position="right">
          <NextButton isLoading={isLoading} isSubmit></NextButton>
        </Group>
      </Stack>
    </form>
  );
}
