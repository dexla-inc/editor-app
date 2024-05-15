import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { Component } from "@/utils/editor";
import { SegmentedControl, Stack } from "@mantine/core";
import { useEditorTreeStore } from "@/stores/editorTree";
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";
import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { DataType } from "@/types/dataBinding";

export type DataProps = {
  component: Component;
  endpoints: Endpoint[] | undefined;
  dataType: DataType;
};

export const CheckboxGroupData = ({
  component,
  endpoints,
  dataType,
}: DataProps) => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const staticFields = [
    {
      name: "data",
      label: "Data",
      type: "text" as FieldType, // textarea
    },
    {
      name: "value",
      label: "Value",
      type: "text" as FieldType,
    },
  ];

  return (
    <Stack spacing="xs">
      <SegmentedControl
        w="100%"
        size="xs"
        value={component.props?.dataType}
        data={[
          { label: "Static", value: "static" },
          { label: "Dynamic", value: "dynamic" },
        ]}
        onChange={(e: DataType) =>
          updateTreeComponentAttrs({
            componentIds: [component.id!],
            attrs: { props: { dataType: e } },
          })
        }
      />
      {dataType === "static" && (
        <FormFieldsBuilder
          fields={staticFields}
          component={component}
          endpoints={endpoints!}
        />
      )}
      {dataType === "dynamic" && (
        <DynamicSettings component={component} endpoints={endpoints!} />
      )}
    </Stack>
  );
};
