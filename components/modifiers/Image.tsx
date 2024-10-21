import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

export const defaultImageValues = requiredModifiers.image;

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, defaultImageValues, {
        fit: selectedComponent?.props?.style?.fit,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <Select
          label="Object Fit"
          size="xs"
          data={[
            { label: "Fill", value: "fill" },
            { label: "Contain", value: "contain" },
            { label: "Cover", value: "cover" },
            { label: "None", value: "none" },
            { label: "Scale down", value: "scale-down" },
          ]}
          {...form.getInputProps("fit")}
          onChange={(value) => {
            form.setFieldValue("fit", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { fit: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
