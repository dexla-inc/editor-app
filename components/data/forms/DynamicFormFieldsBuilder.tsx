import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { extractKeys } from "@/utils/data";
import { Component } from "@/utils/editor";
import { Select } from "@mantine/core";
import { useShareableContent } from "@/hooks/data/useShareableContent";

type DynamicFormFieldsBuilderProps = {
  form: any;
  component: Component;
  endpoints: PagingResponse<Endpoint>;
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
  endpoints,
}: DynamicFormFieldsBuilderProps) => {
  const relatedComponentsData = useShareableContent({ endpoints });
  const parentDataComponent = Object.values(relatedComponentsData).at(-1);

  return (
    <Select
      label={field.label}
      data={extractKeys(parentDataComponent)}
      {...form.getInputProps(`onLoad.${field.name}.dynamic`)}
      searchable
    />
  );
};
