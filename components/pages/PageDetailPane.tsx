import { createPage } from "@/requests/pages/mutations";
import { PageBody, PageResponse } from "@/requests/pages/types";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import { Button, Flex, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useState } from "react";

type PageDetailPaneProps = {
  setShowDetail: (id: boolean) => void;
  page?: PageResponse;
};

export default function PageDetailPane({
  setShowDetail,
  page,
}: PageDetailPaneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const router = useRouter();
  const projectId = router.query.id as string;

  const form = useForm<PageBody>({
    initialValues: {
      title: "",
      slug: "",
      isHome: false,
      authenticatedOnly: false,
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

  const onSubmit = async (values: PageBody) => {
    try {
      setIsLoading(true);

      startLoading({
        id: "mutating",
        title: "Saving Page",
        message: "Wait while your page is being saved",
      });

      form.validate();

      const result = await createPage(values, projectId);

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
            onClick={() => setShowDetail(false)}
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
            />
            <TextInput
              label="Slug"
              placeholder="dashboard-analysis"
              {...form.getInputProps("slug")}
            />
            <Button type="submit" loading={isLoading}>
              {page ? "Save" : "Create"}
            </Button>
          </Stack>
        </form>
      </Flex>
    </>
  );
}
