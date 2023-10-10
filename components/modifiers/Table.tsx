import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Divider, Stack, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTable } from "@tabler/icons-react";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconTable;
export const label = "Table";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: {
      data: "",
      headers: {},
      config: {},
    },
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "data",
        "exampleData",
        "dataPath",
        "headers",
        "config",
      ]);

      let _data = isEmpty(data.exampleData?.value ?? data.exampleData)
        ? data
        : data.exampleData?.value ?? data.exampleData;

      if (data.dataPath) {
        _data = get(_data, data.dataPath.replace("[0]", ""));
      }

      form.setValues({
        data: JSON.stringify(_data, null, 2),
        headers: data.headers,
        config: data.config,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <Divider label="Headers" labelPosition="center" />
        {form.values.data &&
          Object.keys(JSON.parse(form.values.data)[0] ?? {}).map((key) => {
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
                JSON.parse(e.target.value ?? ""),
              );
            } catch (error) {
              console.log(error);
            }
          }}
        />
      </Stack>
    </form>
  );
});
