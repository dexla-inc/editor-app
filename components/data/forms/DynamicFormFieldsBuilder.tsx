import { Select } from "@mantine/core";
import { Component, getComponentById } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";
import get from "lodash.get";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";

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

  const parentDataComponent = getComponentById(
    editorTree.root,
    component.parentDataComponentId!,
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

  const selectableObjectKeys = Object.keys(
    Array.isArray(selectableObject) ? selectableObject[0] : selectableObject,
  );

  return (
    <Select
      label={field.label}
      data={selectableObjectKeys}
      {...form.getInputProps(`onLoad.${field.name}.dynamic`)}
    />
  );
};
