import { ProjectParams, createProject } from "@/requests/projects/mutations";
import {
  Button,
  Divider,
  Flex,
  Group,
  Radio,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  LoadingStore,
  ProjectTypeMap,
  ProjectTypes,
  StepperState,
} from "./projectTypes";

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
}: StepperState & LoadingStore) {
  const form = useForm({
    initialValues: {
      description: "",
      type: "INNOVATION" as ProjectTypes,
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
    stopLoading({
      id: "creating-project",
      title: "Project Created",
      message: "The project was created successfully",
    });
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Website URL"
          description="Enter the URL of your website to fetch your brand"
          required
          withAsterisk={false}
          disabled={true}
          {...form.getInputProps("websiteUrl")}
        />
        <Radio.Group
          {...form.getInputProps("type")}
          label="What are you building?"
          description="Choose what you want to build"
        >
          <Group mt="xs" spacing="xl">
            {Object.entries(projectInfo).map(([value, { title, example }]) => (
              <Radio
                key={value}
                value={value}
                label={title}
                description={example}
                sx={{ maxWidth: 200 }}
              />
            ))}
          </Group>
        </Radio.Group>
        <TextInput
          label={projectInfo[form.values.type].label}
          description={projectInfo[form.values.type].placeholder}
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
          description={projectInfo[form.values.type].industryPlaceholder}
          {...form.getInputProps("industry")}
          sx={{
            width: "650px",
          }}
        />
        <Divider></Divider>
        <Group position="right">
          <Button
            onClick={nextStep}
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            Next
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
