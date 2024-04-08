import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

export const ModalData = ({ component }: DataProps) => {
  const form = useForm({
    initialValues: {
      onLoad: {
        forceHide: false,
      },
      props: {
        style: {
          display: component.props?.style?.display,
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
      <VisibilityModifier
        componentId={component.id!}
        componentName={component.name}
        form={form}
      />
      <SegmentedControlYesNo
        label="Force Hide in Editor"
        {...form.getInputProps("onLoad.forceHide")}
        onChange={(value) => {
          form.setFieldValue("onLoad.forceHide", value);
        }}
      />
    </Stack>
  );
};
