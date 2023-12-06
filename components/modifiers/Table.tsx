import { WarningAlert } from "@/components/Alerts";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Divider, Stack, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTable } from "@tabler/icons-react";
import get from "lodash.get";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";

export const icon = IconTable;
export const label = "Table";

const initialValues = {
  data: "",
  headers: {},
  config: {},
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const {
      data: dataProp,
      exampleData,
      dataPath,
      headers,
      config,
      repeatedIndex,
    } = pick(selectedComponent.props!, [
      "data",
      "exampleData",
      "dataPath",
      "headers",
      "config",
      "repeatedIndex",
    ]);

    let data = dataProp?.value ?? exampleData?.value;

    if (typeof repeatedIndex !== "undefined" && dataPath) {
      const path = dataPath.replace("[0]", `[${repeatedIndex}]`);
      data = get(dataProp?.base ?? {}, path) ?? data;
    } else if (dataPath) {
      data = get(dataProp?.base, dataPath.replace("[0]", ""));
    }

    const form = useForm({
      initialValues: merge({}, initialValues, {
        data: JSON.stringify(data, null, 2),
        headers: headers,
        config: config,
      }),
    });

    const isThereAnyConfigChecked =
      get(form.values.config, "select", false) ||
      get(form.values.config, "sorting", false);

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
                  checked={get(form.values.headers, key, false)}
                  onChange={(e) => {
                    const headers = {
                      ...form.values.headers,
                      [key]: e.currentTarget.checked,
                    };
                    form.setFieldValue("headers", headers);
                    debouncedTreeUpdate(selectedComponentIds, { headers });
                  }}
                />
              );
            })}
          <Divider label="Config" labelPosition="center" />
          <Switch
            size="xs"
            label="Sorting"
            checked={get(form.values.config, "sorting", false)}
            onChange={(e) => {
              const config = {
                ...form.values.config,
                sorting: e.currentTarget.checked,
              };
              form.setFieldValue("config", config);
              debouncedTreeUpdate(selectedComponentIds, { config });
            }}
          />
          <Switch
            size="xs"
            label="Select"
            checked={get(form.values.config, "select", false)}
            onChange={(e) => {
              const config = {
                ...form.values.config,
                select: e.currentTarget.checked,
              };
              form.setFieldValue("config", config);
              debouncedTreeUpdate(selectedComponentIds, { config });
            }}
          />
          {isThereAnyConfigChecked && (
            <WarningAlert text="Ensure that you bind the action for the activated configurations" />
          )}
          <Divider label="Data" labelPosition="center" />
          <Textarea
            autosize
            label="Data"
            size="xs"
            {...form.getInputProps("data")}
            onChange={(e) => {
              form.setFieldValue("data", e.target.value);
              try {
                debouncedTreeUpdate(selectedComponentIds, {
                  data: JSON.parse(e.target.value ?? ""),
                });
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </Stack>
      </form>
    );
  },
);
