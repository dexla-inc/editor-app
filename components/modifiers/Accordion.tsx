import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutBottombarCollapse } from "@tabler/icons-react";
import { IconSelector } from "../IconSelector";
import merge from "lodash.merge";

const defaultInputValues = { variant: "default", icon: "" };

export const icon = IconLayoutBottombarCollapse;
export const label = "Accordion";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultInputValues, {
        variant: selectedComponent.props?.variant,
        icon: selectedComponent.props?.icon,
      }),
    });

    const data: Record<string, string> = {
      Default: "default",
      Contained: "contained",
      Filled: "filled",
      Separated: "separated",
    };

    return (
      <form>
        <Stack spacing="xs">
          <Select
            label="Value"
            size="xs"
            data={Object.keys(data).map((key) => ({
              label: key,
              value: data[key],
            }))}
            {...form.getInputProps("variant")}
            onChange={(value) => {
              form.setFieldValue("variant", value as string);
              debouncedTreeUpdate(selectedComponentIds, { variant: value });
            }}
          />
          <IconSelector
            topLabel="Icon"
            selectedIcon={form.values.icon}
            onIconSelect={(value: string) => {
              form.setFieldValue("icon", value);
              debouncedTreeUpdate(selectedComponentIds, { icon: value });
            }}
          />
        </Stack>
      </form>
    );
  },
);
