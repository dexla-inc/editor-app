import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import get from "lodash.get";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";

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

const Modifier = withModifier(({ selectedComponent }) => {
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

  const form = useForm<TableModifierProps>({
    initialValues: merge({}, initialValues, {
      data: JSON.stringify(data, null, 2),
      headers: headers,
      config: config,
      striped: striped,
    }),
  });

  return (
    <form>
      <Stack spacing="xs">
        <Switch
          label="Striped"
          {...form.getInputProps("striped")}
          onChange={(event) => {
            form.setFieldValue("striped", event.currentTarget.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { striped: event.currentTarget.checked } },
            });
          }}
        />
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { config } },
            });
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
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { config } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
