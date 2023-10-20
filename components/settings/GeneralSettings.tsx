import RegionSelect from "@/components/RegionSelect";
import {
  ProjectUpdateParams,
  patchProject,
} from "@/requests/projects/mutations";
import { RegionTypes, getProject } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import {
  Button,
  Container,
  Flex,
  Loader,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
};

export default function GeneralSettings({ projectId }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<RegionTypes>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const form = useForm<ProjectUpdateParams>({
    initialValues: {
      friendlyName: "",
      region: undefined,
    },
    validate: {
      friendlyName: (value) =>
        (value?.length ?? 0) > 50 ? "Description too long" : null,
    },
  });

  const onSubmit = async (values: ProjectUpdateParams) => {
    try {
      startLoading({
        id: "updating-project",
        title: "Updating Project",
        message: "Wait while your project is being updated",
      });
      setIsLoading(true);

      form.validate();

      const patchParams = convertToPatchParams<ProjectUpdateParams>(values);
      await patchProject(projectId, patchParams);

      stopLoading({
        id: "updating-project",
        title: "Project Updated",
        message: "The project was updated successfully",
      });
      setIsLoading(false);
    } catch (error: any) {
      stopLoading({
        id: "updating-project",
        title: "Project Updated",
        message: error,
        isError: true,
      });
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const project = await getProject(projectId);
      form.setFieldValue("friendlyName", project.friendlyName);
      form.setFieldValue("region", project.region.type);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    setSelectedRegion(form.values.region as RegionTypes);
  }, [form.values.region]);

  return (
    <Container py="xl">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xl">
          <Title order={2}>General Settings</Title>
          <TextInput
            label="Project Name"
            required
            withAsterisk={true}
            {...form.getInputProps("friendlyName")}
            sx={{ maxWidth: "400px" }}
            rightSection={isLoading && <Loader size="xs" />}
          />
          <RegionSelect
            value={selectedRegion}
            onChange={(value: RegionTypes) => {
              console.log(value);
              form.setFieldValue("region", value);
              setSelectedRegion(value);
            }}
            sx={{ maxWidth: "400px" }}
          ></RegionSelect>
          <Flex>
            <Button type="submit" loading={isLoading} disabled={isLoading}>
              Save
            </Button>
          </Flex>
        </Stack>
      </form>
    </Container>
  );
}
