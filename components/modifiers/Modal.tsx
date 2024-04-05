import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Checkbox, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlSizes } from "../SegmentedControlSizes";
import { inputSizes } from "@/utils/defaultSizes";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

export const modalAndDrawerSizingData = [
  { label: "None", value: "0" },
  { label: "Extra Small", value: "xs" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Extra Large", value: "xl" },
  { label: "Full Screen", value: "fullScreen" },
];

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.modal, {
        size: selectedComponent?.props?.size,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <SegmentedControlSizes
          label="Size"
          data={modalAndDrawerSizingData}
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { size: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
