import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCircleDot } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { TopLabel } from "../TopLabel";

export const icon = IconCircleDot;
export const label = "Button Icon";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.buttonIcon, {
          bg: selectedComponent.props?.bg,
          width: selectedComponent.props?.style?.width,
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
          <Stack spacing={2}>
            <TopLabel text="Width" />
            <SegmentedControl
              size="xs"
              data={[
                { label: "Fit Content", value: "fit-content" },
                { label: "Auto", value: "auto" },
              ]}
              {...form.getInputProps("width")}
              onChange={(value) => {
                form.setFieldValue("width", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { width: value },
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
