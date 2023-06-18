import { Shell } from "@/components/AppShell";
import { ProjectParams, createProject } from "@/requests/projects/mutations";
import { useAppStore } from "@/stores/app";
import {
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Radio,
  Stack,
  Stepper,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";

export default function New() {
  const router = useRouter();
  const isLoading = useAppStore((state) => state.isLoading);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

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
    router.push(`/projects/${project.id}`);
  };

  return (
    <Shell>
      <Container py={60}>
        <Heading></Heading>
        <StepperContainer></StepperContainer>
        {/* <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Project Description"
              description="Describe what the project is about to help AI create tailored pages for you"
              required
              withAsterisk={false}
              {...form.getInputProps("description")}
            />
            <Group position="left">
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                Create Project
              </Button>
            </Group>
          </Stack>
        </form> */}
      </Container>
    </Shell>
  );
}

interface StepInformation {
  name: string;
  description: string;
}

function Heading(stepInformation: StepInformation) {
  return (
    <Stack>
      <Title order={2}>{stepInformation.description}</Title>
    </Stack>
  );
}

function StepperContainer() {
  return (
    <Flex>
      <ProjectStepper />
      <StepperContent />
    </Flex>
  );
}

function ProjectStepper(active: number, setActive: (index: number) => void) {
  return (
    <Stepper active={active} onStepClick={setActive} orientation="vertical">
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

function StepperContent() {
  return (
    <Container size="sm">
      <ProjectStep></ProjectStep>
      <Divider></Divider>
      <ButtonFooter></ButtonFooter>
    </Container>
  );
}

function ProjectStep() {
  const form = useForm({
    initialValues: {
      description: "",
      type: "INNOVATION" as ProjectTypes,
      websiteUrl: "",
      industry: "",
    },
  });

  const onSubmit = async (values: ProjectParams) => {};
  var a = Object.values(projectInfo);
  return (
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
        <Group mt="xs" spacing="xl" py="md">
          {Object.entries(projectInfo).map(
            ([value, { title, placeholder, example }]) => (
              <Radio
                key={value}
                value={value}
                label={title}
                description={example}
                sx={{ maxWidth: 200 }}
              />
            )
          )}
        </Group>
      </Radio.Group>
      <TextInput
        label="Description"
        description="Describe what the project is about to help AI create tailored pages for you"
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
        placeholder={projectInfo[form.values.type].label}
        {...form.getInputProps("industry")}
        sx={{
          width: "650px",
        }}
      />
    </Stack>
  );
}

function ButtonFooter(
  nextStep: MouseEventHandler,
  prevStep: MouseEventHandler
) {
  return (
    <Flex>
      <Button onClick={prevStep} variant="outline">
        Back
      </Button>
      <Button onClick={nextStep}>Next</Button>
      <Button>Generate app</Button>
    </Flex>
  );
}

type ProjectInfo<
  TLabel extends string = string,
  TPlaceholder extends string = string,
  TExample extends string = string,
  TTitle extends string = string
> = {
  label: TLabel;
  placeholder: TPlaceholder;
  example: TExample;
  title: TTitle;
};

type ProjectTypes = "INNOVATION" | "SIMILAR" | "INTERNAL";

type ProjectTypeMap = Record<ProjectTypes, ProjectInfo>;

const projectInfo: ProjectTypeMap = {
  INNOVATION: {
    label: "What do you do? *",
    placeholder:
      "Your one-line e.g. A platform to manage small business financial data",
    example: "e.g. A platform to manage small business financial data",
    title: "Unique Product",
  },
  SIMILAR: {
    label: "Why are you different? *",
    placeholder:
      "Your differentiation e.g. A niche version for sustainable stays",
    example: "e.g AirBnb but a niche version for sustainable stays",
    title: "Similar To Another Company",
  },
  INTERNAL: {
    label: "What do you want to build? *",
    placeholder:
      "Your ideal solution e.g. A health and well-being platform for employees",
    example: "e.g. A health and well being platform for employees",
    title: "Internal Tool",
  },
};
