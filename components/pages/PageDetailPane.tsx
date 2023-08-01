import { createPage, deletePage, updatePage } from "@/requests/pages/mutations";
import { PageBody, PageResponse } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import { Button, Flex, Stack, TextInput } from "@mantine/core";
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

  const form = useForm<PageBody>({
    initialValues: {
      title: "",
      slug: "",
      isHome: false,
      authenticatedOnly: false,
      hasNavigation: false,
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

  useEffect(() => {
    if (page) {
      form.setFieldValue("title", page.title);
      form.setFieldValue("slug", page.slug.toLowerCase());
      setSlug(page.slug);
    }
  }, [page]);

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

      form.validate();

      const result = page
        ? await updatePage(values, projectId, page.id)
        : await createPage(values, projectId);

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

  return (
    <>
      <Flex>
        <form onSubmit={form.onSubmit(onSubmit)} style={{ width: "100%" }}>
          <Button
            onClick={() => setPage(undefined)}
            variant="subtle"
            leftIcon={<IconArrowLeft size={ICON_SIZE} />}
          >
            Back
          </Button>
          <Stack mt="sm">
            <TextInput
              label="Page Title"
              placeholder="Dashboard Analysis"
              {...form.getInputProps("title")}
              onChange={(event) => {
                form.getInputProps("title").onChange(event);
                const newSlug = slugify(event.currentTarget.value, {
                  lower: true,
                });
                page?.id ?? setSlug(newSlug);
                page?.id ?? form.setFieldValue("slug", newSlug);
                page?.id ?? form.setTouched({ slug: false });
              }}
            />
            <TextInput
              label="Slug"
              placeholder="dashboard-analysis"
              {...form.getInputProps("slug")}
              value={slug}
              onChange={(event) => {
                const newSlug = event.target.value;
                if (page?.id) {
                  setSlug(newSlug);
                  form.setFieldValue("slug", newSlug);
                  form.setTouched({ slug: true });
                }
              }}
            />
            <Button type="submit" loading={isLoading}>
              {page ? "Save" : "Create"}
            </Button>
            <Button loading={isLoading} onClick={deleteFn} color="red">
              Delete
            </Button>
            {page?.pageState && (
              <Button
                loading={isLoading}
                onClick={(e) => {
                  const pageStructure = decodeSchema(page.pageState!);
                  copy(pageStructure);
                }}
                variant="default"
              >
                {copied ? "Copied" : `Copy Page`}
              </Button>
            )}
          </Stack>
        </form>
      </Flex>
    </>
  );
}
