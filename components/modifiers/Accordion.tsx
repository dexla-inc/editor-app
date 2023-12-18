import { IconSelector } from "@/components/IconSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutBottombarCollapse } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayoutBottombarCollapse;
export const label = "Accordion";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    const data: Record<string, string> = {
      Default: "default",
      Contained: "contained",
      Filled: "filled",
      Separated: "separated",
    };

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.accordion, {
          variant: selectedComponent.props?.variant,
          icon: selectedComponent.props?.icon,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

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
            selectedIcon={form.values.icon as string}
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
