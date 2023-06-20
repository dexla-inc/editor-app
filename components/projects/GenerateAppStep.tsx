import BackButton from "@/components/projects/BackButton";
import { ProjectParams, createProject } from "@/requests/projects/mutations";
import { LoadingStore, StepperClickEvents } from "@/utils/projectTypes";
import { Group, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function GenerateAppStep({
  prevStep,
  nextStep,
  isLoading,
  startLoading,
  stopLoading,
  projectId,
}: StepperClickEvents & LoadingStore & { projectId: string }) {
  const form = useForm({
    initialValues: {
      friendlyName: "",
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
    <Stack>
      <Group position="apart">
        <BackButton onClick={prevStep as () => void}></BackButton>
      </Group>
    </Stack>
  );
}
