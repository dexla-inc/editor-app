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
      merge({}, requiredModifiers.textEditor, {
        bg: selectedComponent?.props?.bg,
        textColor: selectedComponent?.props?.textColor,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
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
