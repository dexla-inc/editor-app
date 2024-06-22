import { useProjectQuery } from "@/hooks/editor/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { decodeSchema, encodeSchema } from "@/utils/compression";
import { convertToPatchParams } from "@/types/dashboardTypes";
import { Button, Card, Stack, Text, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { safeJsonParse } from "@/utils/common";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

const editorOptions = {
  automaticLayout: true,
  minimap: { enabled: false },
  lineNumbers: { enabled: false },
  contextmenu: false,
  language: {
    javascript: {
      globalKnownSymbols: {
        data: true,
      },
    },
  },
  fontSize: 12,
};

export const EditorNavbarCustomCodeSection = () => {
  const { id: projectId } = useEditorParams();
  const [isSaving, setIsSaving] = useState(false);
  const { data: project, refetch } = useProjectQuery(projectId);
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      headCode: "",
      footerCode: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      const patchParams = convertToPatchParams({
        customCode: encodeSchema(JSON.stringify(values)),
      });
      await patchProject(projectId, patchParams);
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (project) {
      const customCode = project.customCode
        ? safeJsonParse(decodeSchema(project.customCode))
        : undefined;
      if (customCode) {
        form.setValues(customCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack p="xs" pr={0}>
        <Stack spacing={0}>
          <Text size="xs" fw="bold">
            Head Code
          </Text>
          <Card style={{ overflow: "visible" }} withBorder radius="sm" px={0}>
            <Editor
              theme={theme.colorScheme === "dark" ? "vs-dark" : "light"}
              width="100%"
              height="150px"
              defaultLanguage="javascript"
              {...form.getInputProps("headCode")}
              options={editorOptions}
            />
          </Card>
        </Stack>
        <Stack spacing={0}>
          <Text size="xs" fw="bold">
            Footer Code
          </Text>
          <Card style={{ overflow: "visible" }} withBorder radius="sm" px={0}>
            <Editor
              theme={theme.colorScheme === "dark" ? "vs-dark" : "light"}
              width="100%"
              height="150px"
              defaultLanguage="javascript"
              {...form.getInputProps("footerCode")}
              options={editorOptions}
            />
          </Card>
        </Stack>
        <Button
          type="submit"
          size="sm"
          compact
          loading={isSaving}
          disabled={isSaving}
        >
          Save
        </Button>
      </Stack>
    </form>
  );
};
