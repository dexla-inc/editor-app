import { Icon } from "@/components/Icon";
import { QueryStringsForm } from "@/components/QueryStringsForm";
import { createPage, deletePage, updatePage } from "@/requests/pages/mutations";
import {
  PageBody,
  PageResponse,
  QueryStringListItem,
} from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useClipboard } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import slugify from "slugify";

type PageDetailPaneProps = {
  page?: PageResponse | null | undefined;
  setPage: (page?: PageResponse | null | undefined) => void;
  getPages: () => void;
};

export default function PageDetailPane({
  page,
  setPage,
  getPages,
}: PageDetailPaneProps) {
  const { copy, copied } = useClipboard();
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const router = useRouter();
  const projectId = router.query.id as string;
  const [slug, setSlug] = useState("");
  const queryClient = useQueryClient();
  const resetTree = useEditorStore((state) => state.resetTree);
  const queryStringState = useState(
    page?.queryStrings
      ? Object.entries(page?.queryStrings || {}).map(([key, value]) => ({
          key,
          value,
        }))
      : []
  );

  const form = useForm<PageBody>({
    initialValues: {
      title: "",
      slug: "",
      isHome: false,
      authenticatedOnly: false,
      hasNavigation: false,
      copyFrom: undefined,
      queryStrings: {},
    },
    validate: {
      title: (value) =>
        value === ""
          ? "You must provide a title"
          : value.length > 50
          ? "Title too long"
          : null,
      slug: (value) =>
        value === ""
          ? "You must provide a slug"
          : value.length > 100
          ? "Slug too long"
          : null,
    },
  });

  const deleteFn = async () => {
    try {
      setIsLoading(true);

      startLoading({
        id: "deleting",
        title: "Deleting Page",
        message: "Wait while your page is being deleted",
      });

      await deletePage(projectId, page?.id as string);
      queryClient.invalidateQueries(["pages"]);
      getPages();
      setIsLoading(false);

      stopLoading({
        id: "deleting",
        title: "Page Deleted",
        message: "Your page has been deleted",
      });

      setPage(undefined);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: PageBody) => {
    try {
      setIsLoading(true);
      startLoading({
        id: "mutating",
        title: "Saving Page",
        message: "Wait while your page is being saved",
      });

      values.queryStrings = queryStringState[0].reduce(
        (acc: Record<string, string>, item: QueryStringListItem) => {
          acc[item.key] = item.value;
          return acc;
        },
        {}
      );

      form.validate();

      if (page?.id) {
        await updatePage(values, projectId, page.id);
      } else {
        const result = await createPage(values, projectId);
        router.push(`/projects/${projectId}/editor/${result.id}`);
        resetTree();
      }

      queryClient.invalidateQueries(["pages"]);
      getPages();
      stopLoading({
        id: "mutating",
        title: "Page Saved",
        message: "The page was saved successfully",
      });

      setIsLoading(false);
    } catch (error) {
      stopLoading({
        id: "mutating",
        title: "Page Failed",
        message: "Validation failed",
      });
      setIsLoading(false);
    }
  };

  const duplicate = () => {
    setPage({
      id: "",
      title: "",
      slug: "",
      isHome: false,
      authenticatedOnly: false,
      hasNavigation: false,
      copyFrom: {
        id: page!.id as string,
        type: "PAGE",
      },
      queryStrings: {},
    });

    form.setFieldValue("copyFrom", {
      id: page!.id as string,
      type: "PAGE",
    });

    form.setFieldValue("title", "");
    form.setFieldValue("slug", "");
    form.setFieldValue("isHome", false);
    form.setFieldValue("authenticatedOnly", false);
    form.setFieldValue("hasNavigation", false);
    form.setFieldValue("queryStrings", {});
  };

  useEffect(() => {
    if (page) {
      form.setFieldValue("title", page.title);
      form.setFieldValue("slug", page.slug.toLowerCase());
      form.setFieldValue("queryStrings", page.queryStrings);
      setSlug(page.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <Flex>
        <form onSubmit={form.onSubmit(onSubmit)} style={{ width: "100%" }}>
          <Group noWrap sx={{ justifyContent: "space-between" }}>
            <Button
              onClick={() => setPage(undefined)}
              variant="subtle"
              leftIcon={<IconArrowLeft size={ICON_SIZE} />}
            >
              Back
            </Button>
            <Group sx={{ gap: "5px" }}>
              {page?.id && (
                <Tooltip
                  withArrow
                  color="green"
                  label="Duplicate"
                  sx={{ fontSize: "0.75rem" }}
                >
                  <ActionIcon
                    loading={isLoading}
                    onClick={duplicate}
                    color="yellow"
                    variant="light"
                    radius="xl"
                  >
                    <Icon name="IconCopy" size={ICON_SIZE} />
                  </ActionIcon>
                </Tooltip>
              )}
              {page?.pageState && (
                <Tooltip
                  withArrow
                  color="orange"
                  label={copied ? "Copied" : "Copy Design"}
                  sx={{ fontSize: "0.75rem" }}
                >
                  <ActionIcon
                    loading={isLoading}
                    onClick={(e) => {
                      const pageStructure = decodeSchema(page.pageState!);
                      copy(pageStructure);
                    }}
                    color="grape"
                    variant="light"
                    radius="xl"
                  >
                    <Icon name="IconPhotoPlus" size={ICON_SIZE} />
                  </ActionIcon>
                </Tooltip>
              )}
              {page?.id && (
                <Tooltip
                  withArrow
                  color="red"
                  label="Delete"
                  sx={{ fontSize: "0.75rem" }}
                >
                  <ActionIcon
                    loading={isLoading}
                    onClick={deleteFn}
                    color="red"
                    variant="light"
                    radius="xl"
                  >
                    <Icon name="IconTrash" size={ICON_SIZE} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          </Group>
          <Stack my="sm">
            <TextInput
              label="Page Title"
              placeholder="Dashboard Analysis"
              {...form.getInputProps("title")}
              onChange={(event) => {
                form.getInputProps("title").onChange(event);
                const newSlug = slugify(event.currentTarget.value, {
                  lower: true,
                });
                setSlug(newSlug);
                form.setFieldValue("slug", newSlug);
                form.setTouched({ slug: false });
              }}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
            />
            <TextInput
              label="Slug"
              placeholder="dashboard-analysis"
              {...form.getInputProps("slug")}
              value={slug}
              onChange={(event) => {
                const newSlug = event.target.value;
                setSlug(newSlug);
                form.setFieldValue("slug", newSlug);
                form.setTouched({ slug: true });
              }}
            />

            <QueryStringsForm queryStringState={queryStringState} />

            {page ? (
              <Button type="submit" loading={isLoading}>
                Save
              </Button>
            ) : (
              <Button type="submit" loading={isLoading}>
                Create
              </Button>
            )}
          </Stack>
        </form>
      </Flex>
    </>
  );
}
