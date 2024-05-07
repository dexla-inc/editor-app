import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import { Button, Select, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

type Params = {
  redirects?: {
    signInPageId?: string;
    notFoundPageId?: string;
  };
};

const mapPagesToSelectData = (pages: any[]) => {
  return pages.map((page) => ({
    value: page.id,
    label: page.title,
  }));
};

export const ProjectSettings = () => {
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

  const pagesMinimal = mapPagesToSelectData(pages);

  useEffect(() => {
    form.setValues({
      // new fields
      redirects: {
        signInPageId: project?.redirects?.signInPageId,
        notFoundPageId: project?.redirects?.notFoundPageId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Title order={3}>Redirections</Title>
        <Select
          label="Sign in page"
          description="Page redirected to when a user is not signed in."
          data={pagesMinimal}
          {...form.getInputProps("redirects.signInPageId")}
          clearable
          searchable
        />
        <Select
          label="Not found page"
          description="Page redirected to when a page is not found."
          data={pagesMinimal}
          {...form.getInputProps("redirects.notFoundPageId")}
          clearable
          searchable
        />
        <Button type="submit" loading={isLoading}>
          Save
        </Button>
      </Stack>
    </form>
  );
};
