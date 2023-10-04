import { getPage } from "@/requests/pages/queries";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { OpenModalAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
import { Component, getAllComponentsByName } from "@/utils/editor";
import { Button, Select, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<OpenModalAction, "name">;

export const OpenModalFlowActionForm = ({ form }: Props) => {
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { setTree, tree: editorTree } = useEditorStore();
  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const modals = getAllComponentsByName(editorTree.root, "Modal");

  const { data: page } = useQuery({
    queryKey: ["page", projectId, pageId],
    queryFn: async () => {
      return await getPage(projectId, pageId);
    },
    enabled: !!projectId && !!pageId,
  });

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  return (
    <Stack spacing="xs">
      <Select
        size="xs"
        label="Modal to Open"
        placeholder="Select a modal"
        data={modals.map((modal: Component) => {
          return {
            label: modal.props?.title ?? modal.id,
            value: modal.id!,
          };
        })}
        {...form.getInputProps("modalId")}
      />

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
