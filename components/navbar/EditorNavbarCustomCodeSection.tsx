import { useProjectQuery } from "@/hooks/reactQuery/useProjectQuery";
import { patchProject } from "@/requests/projects/mutations";
import { decodeSchema, encodeSchema } from "@/utils/compression";
import { convertToPatchParams } from "@/utils/dashboardTypes";
import { Button, Card, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const EditorNavbarCustomCodeSection = () => {
  const router = useRouter();
  const projectId = router.query.id as string;
  const [isSaving, setIsSaving] = useState(false);
  const { data: project } = useProjectQuery(projectId);

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
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (project) {
      const customCode = project.customCode
        ? JSON.parse(decodeSchema(project.customCode))
        : undefined;
      if (customCode) {
        form.setValues(customCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Stack spacing={0}>
          <Text size="xs" fw="bold">
            Head Code
          </Text>
          <Card style={{ overflow: "visible" }} withBorder radius="sm" px={0}>
            <Editor
              width="100%"
              height="150px"
              defaultLanguage="javascript"
              {...form.getInputProps("headCode")}
              options={{
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
              }}
            />
          </Card>
        </Stack>
        <Stack spacing={0}>
          <Text size="xs" fw="bold">
            Footer Code
          </Text>
          <Card style={{ overflow: "visible" }} withBorder radius="sm" px={0}>
            <Editor
              width="100%"
              height="150px"
              defaultLanguage="javascript"
              {...form.getInputProps("footerCode")}
              options={{
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
              }}
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
