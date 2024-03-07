import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconBoxModel;
export const label = "Modal";

const Modifier = withModifier(({ selectedComponent, selectedComponentIds }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.modal, {
        size: selectedComponent?.props?.size,
        forceHide: selectedComponent?.props?.forceHide,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <SizeSelector
          label="Size"
          data={[
            { label: "None", value: "0" },
            { label: "Extra Small", value: "xs" },
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
            { label: "Extra Large", value: "xl" },
            { label: "Full Screen", value: "fullScreen" },
          ]}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { size: value } },
            });
          }}
        />

        <Checkbox
          size="xs"
          label="Force Hide"
          {...form.getInputProps("forceHide", { type: "checkbox" })}
          onChange={(e) => {
            form.setFieldValue("forceHide", e.target.checked);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { forceHide: e.target.checked } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
