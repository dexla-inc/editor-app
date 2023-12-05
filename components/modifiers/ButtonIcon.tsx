import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconColorFilter } from "@tabler/icons-react";
import { withModifier } from "@/hoc/withModifier";
import merge from "lodash.merge";

export const icon = IconColorFilter;
export const label = "Background";

export const defaultInputValues = {
  bg: "transparent",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultInputValues, {
        bg: selectedComponent.props?.bg,
      }),
    });

    return (
      <form>
        <Stack spacing="xs">
          <ThemeColorSelector
            label="Background Color"
            {...form.getInputProps("bg")}
            onChange={(value: string) => {
              form.setFieldValue("bg", value);
              debouncedTreeUpdate(selectedComponentIds, { bg: value });
            }}
          />
        </Stack>
      </form>
    );
  },
);
