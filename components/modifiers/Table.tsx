import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Divider, Stack, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTable } from "@tabler/icons-react";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { useEffect } from "react";

export const icon = IconTable;
export const label = "Table";

export const Modifier = () => {
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const componentProps = selectedComponent?.props || {};

  const form = useForm({
    initialValues: {
      data: "",
      headers: {},
      config: {},
    },
  });

  useEffect(() => {
    if (selectedComponentId) {
      const {
        data = {},
        exampleData = {},
        headers = {},
        config = {},
        dataPath,
      } = componentProps;

      let _data = isEmpty(exampleData?.value ?? exampleData)
        ? data
        : exampleData?.value ?? exampleData;

      if (dataPath) {
        _data = get(_data, dataPath.replace("[0]", ""));
      }

      form.setValues({
        data: JSON.stringify(_data, null, 2),
        headers,
        config,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId, componentProps.data, componentProps.exampleData]);

  return (
    <form>
      <Stack spacing="xs">
        <Divider label="Headers" labelPosition="center" />
        {form.values.data &&
          Object.keys(JSON.parse(form.values.data)[0]).map((key) => {
            return (
              <Switch
                size="xs"
                key={key}
                label={key}
                checked={get(form.values.headers, key) ?? false}
                onChange={(e) => {
                  const headers = {
                    ...form.values.headers,
                    [key]: e.currentTarget.checked,
                  };
                  form.setFieldValue("headers", headers);
                  debouncedTreeComponentPropsUpdate("headers", headers);
                }}
              />
            );
          })}
        <Divider label="Config" labelPosition="center" />
        <Switch
          size="xs"
          label="Sorting"
          checked={get(form.values.config, "sorting") ?? false}
          onChange={(e) => {
            const config = {
              ...form.values.config,
              sorting: e.currentTarget.checked,
            };
            form.setFieldValue("config", config);
            debouncedTreeComponentPropsUpdate("config", config);
          }}
        />
        <Switch
          size="xs"
          label="Select"
          checked={get(form.values.config, "select") ?? false}
          onChange={(e) => {
            const config = {
              ...form.values.config,
              select: e.currentTarget.checked,
            };
            form.setFieldValue("config", config);
            debouncedTreeComponentPropsUpdate("config", config);
          }}
        />
        <Switch
          size="xs"
          label="Filter"
          checked={get(form.values.config, "filter") ?? false}
          onChange={(e) => {
            const config = {
              ...form.values.config,
              filter: e.currentTarget.checked,
            };
            form.setFieldValue("config", config);
            debouncedTreeComponentPropsUpdate("config", config);
          }}
        />
        <Switch
          size="xs"
          label="Pagination"
          checked={get(form.values.config, "pagination") ?? false}
          onChange={(e) => {
            const config = {
              ...form.values.config,
              pagination: e.currentTarget.checked,
            };
            form.setFieldValue("config", config);
            debouncedTreeComponentPropsUpdate("config", config);
          }}
        />
        <Switch
          size="xs"
          label="Numbers"
          checked={get(form.values.config, "numbers") ?? false}
          onChange={(e) => {
            const config = {
              ...form.values.config,
              numbers: e.currentTarget.checked,
            };
            form.setFieldValue("config", config);
            debouncedTreeComponentPropsUpdate("config", config);
          }}
        />
        <Divider label="Data" labelPosition="center" />
        <Textarea
          autosize
          label="Data"
          size="xs"
          {...form.getInputProps("data")}
          onChange={(e) => {
            form.setFieldValue("data", e.target.value);
            try {
              debouncedTreeComponentPropsUpdate(
                "data",
                JSON.parse(e.target.value ?? "")
              );
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </Stack>
    </form>
  );
};
