import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.textarea, {
        size: selectedComponent?.props?.size,
        autosize: selectedComponent?.props?.autosize,
        withAsterisk: selectedComponent?.props?.withAsterisk,
        bg: selectedComponent?.props?.bg,
        textColor: selectedComponent?.props?.textColor,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <SegmentedControlYesNo
          label="Required"
          {...form.getInputProps("withAsterisk")}
          onChange={(value) => {
            form.setFieldValue("withAsterisk", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  withAsterisk: value,
                },
              },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Autosize"
          {...form.getInputProps("autosize")}
          onChange={(value) => {
            form.setFieldValue("autosize", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  autosize: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Text Color"
          {...form.getInputProps("textColor")}
          onChange={(value: string) => {
            form.setFieldValue("textColor", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  textColor: value,
                },
              },
            });
          }}
        />
        <ThemeColorSelector
          label="Background Color"
          {...form.getInputProps("bg")}
          onChange={(value: string) => {
            form.setFieldValue("bg", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  bg: value,
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
