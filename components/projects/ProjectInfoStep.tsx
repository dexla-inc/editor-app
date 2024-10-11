import BackButton from "@/components/BackButton";
import { Icon } from "@/components/Icon";
import RegionSelect from "@/components/RegionSelect";
import { patchProject } from "@/requests/projects/mutations";
import { RegionTypes } from "@/requests/projects/types";
import {
  LoadingStore,
  PreviousStepperClickEvent,
  convertToPatchParams,
} from "@/types/dashboardTypes";
import { Button, Divider, Flex, Group, Stack, TextInput } from "@mantine/core";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";

interface ProjectInfoStepProps extends LoadingStore, PreviousStepperClickEvent {
  projectId: string;
  homePageId: string;
  friendlyName: string;
  setFriendlyName: (value: string) => void;
  region: RegionTypes;
  setRegion: (value: RegionTypes) => void;
}

type MutationProps = {
  friendlyName: string;
  region: RegionTypes;
};

export default function ProjectInfoStep({
  prevStep,
  isLoading,
  setIsLoading,
  startLoading,
  stopLoading,
  projectId,
  homePageId,
  friendlyName,
  setFriendlyName,
  region = "US_CENTRAL",
  setRegion,
}: ProjectInfoStepProps) {
  const router = useRouterWithLoader();

  const onSubmit = async () => {
    try {
      setIsLoading && setIsLoading(true);
      startLoading({
        id: "patching",
        title: "Saving",
        message: "Saving the final details",
      });

      const values: MutationProps = {
        friendlyName,
        region,
      };

      const patchParams = convertToPatchParams<MutationProps>(values);

      await patchProject(projectId, patchParams);

      stopLoading({
        id: "patching",
        title: "Saved",
        message: "Buckle up! Let's see your app getting built.",
      });
      setIsLoading && setIsLoading(false);
    } catch (error) {
      stopLoading({
        id: "patching",
        title: "Error",
        message: "Validation failed",
        isError: true,
      });
      setIsLoading && setIsLoading(false);
    }
  };

  const goToEditor = async (projectId: string, homePageId: string) => {
    router.push(`/projects/${projectId}/editor/${homePageId}`);
  };

  const goToDataSource = async (projectId: string) => {
    router.push(`/projects/${projectId}/settings/datasources/new`);
  };

  return (
    <Stack spacing="xl">
      <TextInput
        label="Project Name"
        placeholder="A friendly name for your project"
        value={friendlyName}
        onChange={(event) => setFriendlyName(event.currentTarget.value)}
      />
      <RegionSelect
        value={region}
        onChange={(value: RegionTypes) => {
          setRegion(value);
        }}
      ></RegionSelect>
      <Divider></Divider>
      <Group position="apart">
        <BackButton onClick={prevStep}></BackButton>
        <Flex gap="lg" align="end">
          <Button
            onClick={() => {
              onSubmit();
              goToEditor(projectId, homePageId);
            }}
            loading={isLoading}
            leftIcon={<Icon name="IconSparkles" />}
          >
            Generate app
          </Button>
          {/* {isLoading !== true && (
            <Anchor
              onClick={async () => {
                onSubmit();
                goToEditor(projectId, homePageId);
              }}
            >
              Set up datasource later
            </Anchor>
          )}
          <Button
            onClick={() => {
              onSubmit();
              goToDataSource(projectId);
            }}
            loading={isLoading}
            leftIcon={<Icon name="IconDatabase" />}
          >
            Set up a datasource
          </Button> */}
        </Flex>
      </Group>
    </Stack>
  );
}
