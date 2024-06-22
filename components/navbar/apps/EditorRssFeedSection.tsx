import { Button, Flex, Select, Stack, TextInput, Tooltip } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { AppId } from "../AppItem";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useAppStore } from "@/stores/app";
import { convertToPatchParams, generateId } from "@/types/dashboardTypes";
import { patchProject } from "@/requests/projects/mutations";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import SidebarSection from "@/components/navbar/apps/SidebarSection";
import { Icon } from "@/components/Icon";
import { EndpointSetup } from "./EndpointSetup";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";
import { ProjectAppForm } from "@/types/projectApps";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

type Props = {
  setSelectedApp: (id: AppId | null) => void;
};

export const EditorRssFeedSection = ({ setSelectedApp }: Props) => {
  const { id: projectId } = useEditorParams();

  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const { data: project, refetch } = useProjectQuery(projectId);
  const { endpoints } = useEndpoints(projectId as string);

  const form = useForm<ProjectAppForm>({
    initialValues: {
      apps:
        project?.apps
          ?.filter((a) => a.id === "rss_feed")
          .map((app) => ({
            id: app.id,
            type: "rss_feed",
            configuration: {
              endpointId: app.configuration.endpointId,
              relativeUrl: app.configuration.relativeUrl,
              version: app.configuration.version,
              encoding: app.configuration.encoding,
              resultsKey: app.configuration.resultsKey,
              staleTime: app.configuration.staleTime,
              binds: app.configuration.binds || {
                header: {},
                parameter: {},
                body: {},
              },
            },
          })) ?? [],
    },
  });

  useEffect(() => {
    if (project?.apps) {
      const rssApp = project.apps.filter((a) => a.type === "rss_feed");
      if (rssApp) {
        form.setValues({
          apps: rssApp.map((app) => ({
            id: app.id,
            type: "rss_feed",
            configuration: {
              endpointId: app.configuration.endpointId,
              relativeUrl: app.configuration.relativeUrl,
              version: app.configuration.version,
              encoding: app.configuration.encoding,
              resultsKey: app.configuration.resultsKey,
              staleTime: app.configuration.staleTime,
              binds: app.configuration.binds || {
                header: {},
                parameter: {},
                body: {},
              },
            },
          })),
        });
      }
    }
  }, [project]);

  const onSubmit = async (values: ProjectAppForm) => {
    try {
      startLoading({
        id: "updating-apps",
        title: "Updating Project Apps",
        message: "Wait while your RSS Feed is being updated",
      });

      const updatedValues = { ...values };
      form.values.apps?.forEach((app, index) => {
        const dynamicHeaders =
          form.values.apps![index].configuration.binds.header;
        const dynamicParameters =
          form.values.apps![index].configuration.binds.parameter;
        const dynamicBody = form.values.apps![index].configuration.binds.body;

        if (dynamicHeaders) {
          updatedValues.apps![index].configuration.binds.header =
            dynamicHeaders;
        }
        if (dynamicParameters) {
          updatedValues.apps![index].configuration.binds.parameter =
            dynamicParameters;
        }
        if (dynamicBody) {
          updatedValues.apps![index].configuration.binds.body = dynamicBody;
        }
      });

      form.validate();

      const patchParams = convertToPatchParams<ProjectAppForm>(values);
      await patchProject(projectId, patchParams);
      refetch();

      stopLoading({
        id: "updating-apps",
        title: "Project Apps Updated",
        message: "The RSS Feed was updated successfully",
      });
    } catch (error: any) {
      stopLoading({
        id: "updating-apps",
        title: "Project Apps Failed",
        message: error,
        isError: true,
      });
    }
  };

  const preview = async (endpoint: string) => {
    const apiUrl = `/api/project/${projectId}/xml/${endpoint}`;
    const newTab = window.open(apiUrl, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  const addEmptyRssFeedItem = () => {
    form.insertListItem("apps", {
      id: generateId(),
      type: "rss_feed",
      configuration: {
        endpointId: "",
        relativeUrl: "rss-feed.xml",
        version: "1.0",
        encoding: "UTF-8",
        resultsKey: "",
        staleTime: 30,
        binds: { header: {}, parameter: {}, body: {} },
      },
    });
  };

  const removeRssFeedItem = (id: string) => {
    const index = form.values.apps!.findIndex((app) => app.id === id);
    form.removeListItem("apps", index);
  };

  return (
    <Stack p="xs" pr={0}>
      <Flex>
        <Button
          onClick={() => setSelectedApp(null)}
          variant="subtle"
          leftIcon={<IconArrowLeft size={ICON_SIZE} />}
          compact
        >
          Back
        </Button>
      </Flex>
      <Button
        onClick={addEmptyRssFeedItem}
        variant="default"
        leftIcon={<Icon name="IconPlus"></Icon>}
      >
        Add RSS Feed
      </Button>
      <form onSubmit={form.onSubmit(onSubmit)}>
        {form.values.apps?.map((app, index) => (
          <SidebarSection
            key={app.id}
            id={app.id}
            noPadding={true}
            label={app.configuration.relativeUrl || "RSS Feed"}
            icon="IconRss"
            remove={removeRssFeedItem}
          >
            <Stack>
              <EndpointSetup
                projectApp={app}
                endpoints={endpoints}
                form={form}
                index={index}
              />
              <TextInput
                label="Version"
                {...form.getInputProps(`apps.${index}.configuration.version`)}
                placeholder="1.0"
                w="100%"
              />
              <Select
                label="Encoding"
                data={[
                  {
                    value: "UTF-8",
                    label: "UTF-8",
                  },
                  {
                    value: "UTF-16",
                    label: "UTF-16",
                  },
                  {
                    value: "ISO-8859-1",
                    label: "ISO-8859-1",
                  },
                  {
                    value: "US-ASCII",
                    label: "US-ASCII",
                  },
                ]}
                {...form.getInputProps(`apps.${index}.configuration.encoding`)}
                placeholder="UTF-8"
                w="100%"
              />
              <Tooltip
                label={
                  app.configuration.endpointId
                    ? "View XML File"
                    : "Add an endpoint"
                }
              >
                <div>
                  <Button
                    onClick={() => preview(app.configuration.endpointId)}
                    w="100%"
                    variant="default"
                    leftIcon={<Icon name="IconExternalLink" />}
                    disabled={!app.configuration.endpointId}
                  >
                    Preview XML
                  </Button>
                </div>
              </Tooltip>
            </Stack>
          </SidebarSection>
        ))}
        {form.values.apps && form.values.apps.length > 0 && (
          <Button type="submit" w="100%" my="lg">
            Save
          </Button>
        )}
      </form>
    </Stack>
  );
};
