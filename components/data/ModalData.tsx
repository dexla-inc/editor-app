import { DataProps } from "@/types/dataBinding";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";

export const ModalData = ({ component, endpoints }: DataProps) => {
  const form = useForm({
    initialValues: {
      onLoad: component?.onLoad,
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const fields = [
    {
      name: "title",
      label: "Title",
      fieldType: "Text" as const,
    },
    {
      name: "showInEditor",
      label: "Show in Editor",
      fieldType: "YesNo" as const,
    },
  ];

  return (
    <Stack spacing="xs">
      <FormFieldsBuilder
        fields={fields}
        endpoints={endpoints!}
        component={component}
      />
    </Stack>
  );
};
