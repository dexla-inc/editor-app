import { DataProps } from "@/components/data/type";
import { Stack } from "@mantine/core";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { useForm } from "@mantine/form";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { useEffect } from "react";
import { ComponentToBindFromSegmentedControl } from "@/components/ComponentToBindFromSegmentedControl";

export const DateInputData = ({ component }: DataProps) => {
  const form = useForm({
    initialValues: {
      onLoad: {
        type: component?.onLoad?.type,
        valueFormat: component?.onLoad?.valueFormat,
      },
    },
  });

  useEffect(() => {
    if (form.isDirty() && form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({
        attrs: form.values,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing="xs">
      <ComponentToBindFromSegmentedControl
        label="Type"
        data={[
          {
            label: "Default",
            value: "default",
          },
          {
            label: "Multiple",
            value: "multiple",
          },
          {
            label: "Range",
            value: "range",
          },
        ]}
        {...form.getInputProps("onLoad.type")}
      />
      <ComponentToBindFromSelect
        label="Format"
        data={[
          { label: "DD MMM YYYY", value: "DD MMM YYYY" },
          { label: "DD MM YYYY", value: "DD MM YYYY" },
          { label: "MM DD YYYY", value: "MM DD YYYY" },
          { label: "DD MMM", value: "DD MMM" },
          { label: "DD MMM YY", value: "DD MMM YY" },
          // { label: "DD-DD MMM, YYYY", value: "DD-DD MMM, YYYY" },
        ]}
        placeholder="Select format"
        {...form.getInputProps("onLoad.valueFormat")}
      />
    </Stack>
  );
};
