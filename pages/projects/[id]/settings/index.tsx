import { Shell } from "@/components/AppShell";
import {
  ProjectUpdateParams,
  updateProject,
} from "@/requests/projects/mutations";
import { RegionTypes, getProject } from "@/requests/projects/queries";
import { useAppStore } from "@/stores/app";
import { regionTypeFlags, regionTypeLabels } from "@/utils/dashboardTypes";
import {
  Avatar,
  Button,
  Container,
  Flex,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAuthInfo } from "@propelauth/react";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

const regionTypes = (Object.keys(regionTypeLabels) as RegionTypes[]).map(
  (regionType) => ({
    value: regionType,
    label: regionTypeLabels[regionType],
    flag: regionTypeFlags[regionType],
  })
);

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
  flag: string;
}

const RegionSelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ flag, label, ...others }: ItemProps, ref) => (
    <Paper ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={flag} size="sm" />

        <Text size="sm">{label}</Text>
      </Group>
    </Paper>
  )
);
RegionSelectItem.displayName = "RegionSelectItem";

export default function Settings() {
  const authInfo = useAuthInfo();
  const { user } = authInfo || {};
  const router = useRouter();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const [selectedRegion, setSelectedRegion] = useState<RegionTypes | undefined>(
    undefined
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const projectId = router.query.id as string;

  const form = useForm<ProjectUpdateParams>({
    initialValues: {
      friendlyName: "",
      region: undefined,
    },
    validate: {
      friendlyName: (value) =>
        value.length > 50 ? "Description too long" : null,
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

      await updateProject(projectId, values);

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
  }, [projectId]);

  useEffect(() => {
    setSelectedRegion(form.values.region as RegionTypes);
  }, [form.values.region]);

  return (
    <Shell navbarType="project" user={user}>
      <Container py="xl">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack spacing="xl">
            <Title>General Settings</Title>
            <TextInput
              label="Project Name"
              required
              withAsterisk={true}
              {...form.getInputProps("friendlyName")}
              sx={{ maxWidth: "400px" }}
              rightSection={isLoading && <Loader size="xs" />}
            />
            <Select
              label="Region"
              {...form.getInputProps("region")}
              data={regionTypes}
              sx={{ maxWidth: "400px" }}
              itemComponent={RegionSelectItem}
              icon={
                regionTypeFlags[selectedRegion as RegionTypes] && (
                  <Avatar
                    src={regionTypeFlags[selectedRegion as RegionTypes]}
                    size="sm"
                  />
                )
              }
              onChange={(value: RegionTypes) => {
                form.setFieldValue("region", value);
                setSelectedRegion(value);
              }}
            />
            <Flex>
              <Button type="submit" loading={isLoading} disabled={isLoading}>
                Save
              </Button>
            </Flex>
          </Stack>
        </form>
      </Container>
    </Shell>
  );
}
