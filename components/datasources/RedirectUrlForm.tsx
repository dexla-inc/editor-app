import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import { Button, Select, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

type Params = {
  redirectSlug: string;
};

export const RedirectUrlForm = () => {
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;

  const { data: project } = useProjectQuery(projectId);

  const pages = useEditorStore((state) => state.pages);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Params>({});

  const onSubmit = async (values: Params) => {
    try {
      setIsLoading(true);
      const patchParams = convertToPatchParams<Params>(values);

      await patchProject(projectId, patchParams);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    form.setValues({
      redirectSlug: project?.redirectSlug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Title order={6}>Authentication</Title>
        <Select
          label="Redirection Page"
          description="Select a page to redirect to when the user is not signed in."
          data={pages.map((page) => {
            return {
              value: page.slug,
              label: page.title,
            };
          })}
          {...form.getInputProps("redirectSlug")}
          clearable
        />
        <Button type="submit" loading={isLoading}>
          Save
        </Button>
      </Stack>
    </form>
  );
};
