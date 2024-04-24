import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { extractKeys } from "@/utils/data";
import { Component, getParentComponentData } from "@/utils/editor";
import { Select } from "@mantine/core";
import { useDataBinding } from "@/hooks/dataBinding/useDataBinding";

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
  component,
  form,
  field,
  endpoints,
}: DynamicFormFieldsBuilderProps) => {
  const editorTree = useEditorTreeStore((state) => state.tree);
  const { computeValue } = useDataBinding();

  const parentDataComponent = getParentComponentData(
    editorTree.root,
    component.id!,
    endpoints,
    computeValue,
  );

  return (
    <Select
      label={field.label}
      data={extractKeys(parentDataComponent)}
      {...form.getInputProps(`onLoad.${field.name}.dynamic`)}
      searchable
    />
  );
};
