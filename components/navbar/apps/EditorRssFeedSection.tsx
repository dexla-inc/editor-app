import { Button, Flex, Select, Stack, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { AppId } from "../AppItem";
import { EndpointSelect } from "@/components/EndpointSelect";
import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import useGenerateProjectSlugLink from "@/hooks/editor/useGenerateProjectSlugLink";
import { useParams } from "next/navigation";
import { useAppStore } from "@/stores/app";
import { convertToPatchParams, generateId } from "@/types/dashboardTypes";
import { ProjectUpdateParams } from "@/requests/projects/types";
import { patchProject } from "@/requests/projects/mutations";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import SidebarSection from "@/components/navbar/apps/SidebarSection";
import {
  AUTOCOMPLETE_OFF_PROPS,
  generateProjectSlugLink,
} from "@/utils/common";
import { Icon } from "@/components/Icon";
import { useRouter } from "next/router";

type Props = {
  setSelectedApp: (id: AppId | null) => void;
};

type FormData = Pick<ProjectUpdateParams, "apps">;

export const EditorRssFeedSection = ({ setSelectedApp }: Props) => {
  const { id: projectId } = useParams<{ id: string; page: string }>();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const { data: project, refetch } = useProjectQuery(projectId);

  const form = useForm<FormData>({
    initialValues: {
      apps:
        project?.apps
          ?.filter((a) => a.id === "rss_feed")
          .map((app) => ({
            id: app.id,
            type: "rss_feed",
            configuration: {
              endpoint: app.configuration.endpoint,
              relativeUrl: app.configuration.relativeUrl,
              version: app.configuration.version,
              encoding: app.configuration.encoding,
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
              endpoint: app.configuration.endpoint,
              relativeUrl: app.configuration.relativeUrl,
              version: app.configuration.version,
              encoding: app.configuration.encoding,
            },
          })),
        });
      }
    }
  }, [project]);

  // useEffect(() => {
  //   if (url && relativeUrl) {
  //     setPreviewUrl(new URL(url));
  //   }
  // }, [relativeUrl, url]);

  // useEffect(() => {
  //   setRelativeUrl(form.values.relativeUrl);
  // }, [form.values.relativeUrl]);

  const onSubmit = async (values: FormData) => {
    try {
      startLoading({
        id: "updating-apps",
        title: "Updating Project Apps",
        message: "Wait while your RSS Feed is being updated",
      });

      form.validate();

      const patchParams = convertToPatchParams<FormData>(values);
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
    const apiUrl = `/api/xml/${endpoint}`;
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
        endpoint: "",
        relativeUrl: "rss-feed.xml",
        version: "1.0",
        encoding: "UTF-8",
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
            <Stack p="xs" pr={0}>
              <EndpointSelect
                {...form.getInputProps(`apps.${index}.configuration.endpoint`)}
                isOnLoad
              />
              <Flex align="flex-end" gap="xs" w="100%">
                <TextInput
                  label="Relative URL"
                  {...form.getInputProps(
                    `apps.${index}.configuration.relativeUrl`,
                  )}
                  placeholder="rss-feed.xml"
                  w="100%"
                  {...AUTOCOMPLETE_OFF_PROPS}
                />
                <ActionIconDefault
                  iconName="IconExternalLink"
                  tooltip={app.configuration.relativeUrl}
                  onClick={() => preview(app.configuration.endpoint)}
                  disabled={
                    app.configuration.endpoint === "" ||
                    app.configuration.relativeUrl === ""
                  }
                />
              </Flex>
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

function generateProjectUrl(
  projectId: string,
  domain: string,
  subDomain: string,
  slug: string,
) {
  const fullDomain = subDomain ? `${subDomain}.${domain}` : domain;
  return generateProjectSlugLink(projectId, fullDomain, slug);
}
