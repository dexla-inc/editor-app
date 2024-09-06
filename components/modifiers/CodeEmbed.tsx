import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const initialValues = requiredModifiers.codeEmbed;

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, initialValues, {
        height: selectedComponent?.props?.style?.height,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <UnitInput
          modifierType="size"
          label="Height"
          {...form.getInputProps("height")}
          onChange={(value) => {
            form.setFieldValue("height", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  style: { height: value },
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
