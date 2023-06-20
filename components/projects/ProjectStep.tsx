import { InformationAlert } from "@/components/Alerts";
import NextButton from "@/components/projects/NextButton";
import { ProjectParams, createProject } from "@/requests/projects/mutations";
import {
  LoadingStore,
  ProjectTypeMap,
  ProjectTypes,
  StepperClickEvents,
} from "@/utils/projectTypes";
import { Divider, Flex, Group, Radio, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

const projectInfo: ProjectTypeMap = {
  INNOVATION: {
    label: "What do you do? *",
    placeholder:
      "Your one-liner e.g. A platform to manage small business financial data",
    example: "e.g. A platform to manage small business financial data",
    title: "Unique Product",
    industryPlaceholder: "e.g. Financial Services",
  },
  SIMILAR: {
    label: "Why are you different? *",
    placeholder:
      "Your differentiation e.g. A niche version for sustainable stays",
    example: "e.g Vercel but for backend developers",
    title: "Similar To Another Company",
    industryPlaceholder: "e.g. Software Development",
  },
  INTERNAL: {
    label: "What do you want to build? *",
    placeholder:
      "Your ideal solution e.g. A health and well-being platform for employees",
    example: "e.g. A health and well being platform for employees",
    title: "Internal Tool",
    industryPlaceholder: "e.g. Health and Wellbeing",
  },
};

export default function ProjectStep({
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  setProjectId,
}: StepperClickEvents & LoadingStore & { setProjectId: (id: string) => void }) {
  const form = useForm({
    initialValues: {
      description: "",
      type: null as ProjectTypes | null,
      websiteUrl: "",
      industry: "",
    },
  });

  const onSubmit = async (values: ProjectParams) => {
    startLoading({
      id: "creating-project",
      title: "Creating Project",
      message: "Wait while your project is being created",
    });
    const project = await createProject(values);

    setProjectId(project.id);

    stopLoading({
      id: "creating-project",
      title: "Project Created",
      message: "The project was created successfully",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xl">
        <InformationAlert
          title="Let's get started!"
          text="Unlock the magic of AI! Answer a few questions and we'll tailor a unique experience just for you!"
        />
        <TextInput
          label="Website URL"
          description="Enter the URL of your website to fetch your brand"
          withAsterisk={false}
          disabled={true}
          placeholder="disabled until we implement theme"
          {...form.getInputProps("websiteUrl")}
        />
        <Radio.Group
          {...form.getInputProps("type")}
          label="What are you building?"
          description="Choose what you want to build"
          required
        >
          <Group mt="xs" spacing="xl" py="sm">
            {Object.entries(projectInfo).map(([value, { title, example }]) => (
              <Radio
                key={value}
                value={value}
                label={title}
                description={example}
                sx={{ maxWidth: 220 }}
              />
            ))}
          </Group>
        </Radio.Group>
        {form.values.type && (
          <TextInput
            label={form.values.type && projectInfo[form.values.type].label}
            description={
              form.values.type && projectInfo[form.values.type].placeholder
            }
            required
            withAsterisk={false}
            {...form.getInputProps("description")}
          />
        )}
        {form.values.type === "SIMILAR" && (
          <Flex direction="column">
            <TextInput
              label="Similar Company Name *"
              placeholder="e.g. ABC Company"
              {...form.getInputProps("similarCompany")}
            />
          </Flex>
        )}
        {form.values.type && (
          <TextInput
            label="What industry are you in? *"
            description={
              form.values.type &&
              projectInfo[form.values.type].industryPlaceholder
            }
            {...form.getInputProps("industry")}
            sx={{
              width: "650px",
            }}
          />
        )}
        <Divider></Divider>
        <Group position="right">
          <NextButton onClick={nextStep} isLoading={isLoading}></NextButton>
        </Group>
      </Stack>
    </form>
  );
}
