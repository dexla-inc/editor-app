import { ActionIconDefault } from "@/components/ActionIconDefault";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { createPage, deletePage, patchPage } from "@/requests/pages/mutations";
import { PageConfigProps, PageResponse } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { useEditorTreeStore } from "@/stores/editorTree";
import { convertToPatchParams } from "@/types/dashboardTypes";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import {
  Button,
  Group,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouterWithLoader } from "@/hooks/useRouterWithLoader";
import { useEffect, useState } from "react";
import slugify from "slugify";

type Props = {
  page?: PageResponse | null | undefined;
  setPage: (page?: PageResponse | null | undefined) => void;
};

export default function PageConfig({ page, setPage }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const router = useRouterWithLoader();
  const { id: projectId } = useEditorParams();
  const [slug, setSlug] = useState("");
  const resetTree = useEditorTreeStore((state) => state.resetTree);
  const { invalidate } = usePageListQuery(projectId, null);
  const { data: project } = useProjectQuery(projectId);
  const cssType = useEditorTreeStore((state) => state.cssType);

  const form = useForm<PageConfigProps>({
    initialValues: {
      title: "",
      description: "",
      slug: "",
      authenticatedOnly: false,
      cssType: cssType,
    },
    validate: {
      title: (value) =>
        value === ""
          ? "You must provide a title"
          : value.length > 50
            ? "Title too long"
            : null,
      description: (value) =>
        value.length > 200 ? "Description too long" : null,
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
      invalidate();

      setIsLoading(false);

      stopLoading({
        id: "deleting",
        title: "Page Deleted",
        message: "Your page has been deleted",
      });

      setPage(undefined);
    } catch (error: any) {
      setIsLoading(false);
      stopLoading({
        id: "deleting",
        title: "Page failed to delete",
        message: error || "Something went wrong",
        isError: true,
      });
    }
  };

  const onSubmit = async (values: PageConfigProps) => {
    try {
      setIsLoading(true);
      startLoading({
        id: "mutating",
        title: "Saving Page",
        message: "Wait while your page is being saved",
      });

      // values.queryStrings = queryStringState[0].reduce(
      //   (acc: Record<string, string>, item: QueryStringListItem) => {
      //     acc[item.key] = item.value;
      //     return acc;
      //   },
      //   {},
      // );

      form.validate();
      let pageId = page?.id;
      if (page?.id) {
        const patchParams = convertToPatchParams<PageConfigProps>(values);

        const result = await patchPage(projectId, page.id, patchParams);
        setPage({ ...result, id: pageId } as PageResponse);
      } else {
        const result = await createPage(values, projectId);
        pageId = result.id;
        router.push(`/projects/${projectId}/editor/${result.id}`);
        resetTree();
        setPage({ ...values, id: pageId } as PageResponse);
      }

      invalidate();

      stopLoading({
        id: "mutating",
        title: "Page Saved",
        message: "The page was saved successfully",
      });

      setIsLoading(false);
    } catch (error: any) {
      stopLoading({
        id: "mutating",
        title: "Page Failed",
        message: error,
        isError: true,
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
      cssType: cssType,
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
      if (page.description) form.setFieldValue("description", page.description);
      form.setFieldValue("slug", page.slug?.toLowerCase());
      form.setFieldValue("queryStrings", page.queryStrings);
      form.setFieldValue("authenticatedOnly", page.authenticatedOnly);
      setSlug(page.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)} style={{ width: "100%" }}>
      <Group noWrap sx={{ justifyContent: "space-between" }}>
        <Button
          onClick={() => setPage(undefined)}
          variant="subtle"
          leftIcon={<IconArrowLeft size={ICON_SIZE} />}
          compact
        >
          Back
        </Button>
        <Group sx={{ gap: "5px" }}>
          {page?.id && (
            <ActionIconDefault
              iconName="IconCopy"
              tooltip="Duplicate"
              onClick={duplicate}
            />
          )}
          {page?.id && (
            <ActionIconDefault
              iconName={ICON_DELETE}
              tooltip="Delete"
              onClick={deleteFn}
            />
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
          }}
          {...AUTOCOMPLETE_OFF_PROPS}
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
          onFocus={(event) => {
            if (form.values.slug) return;
            const newSlug = slugify(form.values.title).toLowerCase();
            setSlug(newSlug);
            form.setFieldValue("slug", newSlug);
            form.setTouched({ slug: true });
          }}
        />
        <Tooltip
          label="Set sign-in page in settings"
          // @ts-ignore
          disabled={project?.redirects?.signInPageId}
        >
          <Stack>
            <SegmentedControlYesNo
              label="Authenticated Only"
              {...form.getInputProps("authenticatedOnly")}
              disabled={!project?.redirects?.signInPageId}
            />
          </Stack>
        </Tooltip>

        <Textarea
          label="Description"
          placeholder="The description of the page for SEO"
          {...form.getInputProps("description")}
          onChange={(event) => {
            form.getInputProps("description").onChange(event);
          }}
          size="xs"
        />
        {/* <QueryStringsForm queryStringState={queryStringState} /> */}

        {page ? (
          <Button type="submit" loading={isLoading} compact>
            Save
          </Button>
        ) : (
          <Button type="submit" loading={isLoading} compact>
            Create
          </Button>
        )}
      </Stack>
    </form>
  );
}
