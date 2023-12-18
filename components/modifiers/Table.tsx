import { WarningAlert } from "@/components/Alerts";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Divider, Stack, Switch, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTable } from "@tabler/icons-react";
import get from "lodash.get";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { SwitchSelector } from "../SwitchSelector";
import { useEffect } from "react";

export const icon = IconTable;
export const label = "Table";

type TableModifierProps = {
  data: string;
  headers: Record<string, string | boolean>;
  config: Record<string, boolean>;
  striped: boolean;
};

const initialValues = {
  data: "",
  headers: {},
  config: {},
  striped: false,
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
      striped,
    } = pick(selectedComponent.props!, [
      "data",
      "exampleData",
      "dataPath",
      "headers",
      "config",
      "repeatedIndex",
      "striped",
    ]);

    let data = dataProp?.value ?? exampleData?.value;

    if (typeof repeatedIndex !== "undefined" && dataPath) {
      const path = dataPath.replace("[0]", `[${repeatedIndex}]`);
      data = get(dataProp?.base ?? {}, path) ?? data;
    } else if (dataPath) {
      data = get(dataProp?.base, dataPath.replace("[0]", ""));
    }

    const form = useForm<TableModifierProps>();

    useEffect(() => {
      form.setValues(
        merge({}, initialValues, {
          data: JSON.stringify(data, null, 2),
          headers: headers,
          config: config,
          striped: striped,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const isThereAnyConfigChecked =
      get(form.values.config, "select", false) ||
      get(form.values.config, "sorting", false);

    return (
      <form>
        <Stack spacing="xs">
          <SwitchSelector
            topLabel="Striped"
            {...form.getInputProps("striped")}
            onChange={(event) => {
              form.setFieldValue("striped", event.currentTarget.checked);
              debouncedTreeUpdate(selectedComponentIds, {
                striped: event.currentTarget.checked,
              });
            }}
          />

          <Divider label="Headers" labelPosition="center" />
          {form.values.data &&
            Object.keys(JSON.parse(form.values.data)[0] ?? {}).map((key) => {
              return (
                <Switch
                  size="xs"
                  key={key}
                  label={key}
                  checked={!!get(form.values.headers, key, false)}
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
