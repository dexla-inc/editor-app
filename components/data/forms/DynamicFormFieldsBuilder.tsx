import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { extractKeys } from "@/utils/data";
import { Component, getParentComponentData } from "@/utils/editor";
import { Select } from "@mantine/core";
import get from "lodash.get";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

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

  const parentDataComponent = getParentComponentData(
    editorTree.root,
    component.id!,
  );
  const { data: staticData } = useComputeValue({
    onLoad: parentDataComponent?.onLoad,
  });

  const { dataType = "static" } = parentDataComponent?.props!;
  let selectableObject = staticData;

  if (dataType === "dynamic") {
    const parentEndpoint = endpoints?.results?.find(
      (e) => e.id === parentDataComponent?.onLoad?.endpointId,
    );

    selectableObject = parentDataComponent?.onLoad?.resultsKey
      ? get(
          JSON.parse(parentEndpoint?.exampleResponse || "{}"),
          parentDataComponent?.onLoad?.resultsKey,
        )
      : JSON.parse(parentEndpoint?.exampleResponse || "{}");
  }

  const selectableObjectKeys = extractKeys(selectableObject);

  return (
    <Select
      label={field.label}
      data={selectableObjectKeys}
      {...form.getInputProps(`onLoad.${field.name}.dynamic`)}
      searchable
    />
  );
};
