import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import { extractKeys } from "@/utils/common";
import { Component, getParentComponentData } from "@/utils/editor";
import { Select } from "@mantine/core";
import get from "lodash.get";

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
  const editorTree = useEditorStore((state) => state.tree);

  const parentDataComponent = getParentComponentData(
    editorTree.root,
    component.id!,
  );
  const parentEndpoint = endpoints?.results?.find(
    (e) => e.id === parentDataComponent?.onLoad?.endpointId,
  );

  const selectableObject = parentDataComponent?.onLoad?.resultsKey
    ? get(
        JSON.parse(parentEndpoint?.exampleResponse || "{}"),
        parentDataComponent?.onLoad?.resultsKey,
      )
    : JSON.parse(parentEndpoint?.exampleResponse || "{}");

  const selectableObjectKeys = extractKeys(selectableObject);

  return (
    <Select
      label={field.label}
      data={selectableObjectKeys}
      {...form.getInputProps(`onLoad.${field.name}.dynamic`)}
    />
  );
};
