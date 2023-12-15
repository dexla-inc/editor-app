import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconColorFilter } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconColorFilter;
export const label = "Background";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.buttonIcon, {
          bg: selectedComponent.props?.bg,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

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
