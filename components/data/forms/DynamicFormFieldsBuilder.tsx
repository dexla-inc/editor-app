import { Endpoint } from "@/requests/datasources/types";
import { extractKeys } from "@/utils/data";
import { Component } from "@/utils/editor";
import { Select } from "@mantine/core";
import { useShareableContent } from "@/hooks/data/useShareableContent";

type DynamicFormFieldsBuilderProps = {
  form: any;
  component: Component;
  endpoints: Endpoint[];
  field: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
  };
};

export const DynamicFormFieldsBuilder = ({
  form,
  field,
}: DynamicFormFieldsBuilderProps) => {
  const { relatedComponentsData } = useShareableContent({});
  // last position from relatedComponentsData mean the last parent data being shared and position 1 is the actual value
  // as relatedComponentsData is an Object.entries()
  const parentDataComponent = relatedComponentsData.at(-1)?.[1];

  return (
    <Select
      label={field.label}
      data={extractKeys(parentDataComponent)}
      {...form.getInputProps(`onLoad.${field.name}.dynamic`)}
      searchable
    />
  );
};
