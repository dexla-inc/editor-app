import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/types/dataBinding";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";

export const ModalData = ({ component }: DataProps) => {
  const form = useForm({
    initialValues: {
      onLoad: {
        ...component?.onLoad,
        title: component?.onLoad?.title ?? {
          static: { en: component?.props?.title, fr: component?.props?.title },
        },
      },
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing="xs">
      <StaticFormFieldsBuilder
        field={{
          name: "title",
          label: "Title",
          type: "text",
        }}
        form={form}
      />
      <VisibilityModifier form={form} />
      <SegmentedControlYesNo
        label="Show in Editor"
        {...form.getInputProps("onLoad.showInEditor")}
        onChange={(value) => {
          form.setFieldValue("onLoad.showInEditor", value);
        }}
      />
    </Stack>
  );
};
