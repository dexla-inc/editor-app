import { SelectOptionsForm } from "@/components/data/forms/static/SelectOptionsForm";
import { Endpoint } from "@/requests/datasources/types";
import { Component } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { PagingResponse } from "@/requests/types";
import { DynamicSettings } from "@/components/data/forms/DynamicSettings";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";

export type DataProps = {
  component: Component;
  endpoints: PagingResponse<Endpoint> | undefined;
  dataType: "static" | "dynamic";
};

export const SelectData = ({ component, endpoints, dataType }: DataProps) => {
  const fields = [
    {
      name: "dataLabelKey",
      label: "Label",
    },
    {
      name: "dataValueKey",
      label: "Value",
    },
  ];

  return (
    <Stack spacing="xs">
      {dataType === "static" && <SelectOptionsForm component={component} />}
      {dataType === "dynamic" && (
        <DynamicSettings
          component={component}
          endpoints={endpoints!}
          customKeys={fields.map((f) => f.name)}
        >
          {({ form, selectableObjectKeys }) => {
            return (
              <DynamicFormFieldsBuilder
                title="Options"
                subTitle="Set up the data structure"
                form={form}
                fields={fields}
                selectableObjectKeys={selectableObjectKeys}
              />
            );
          }}
        </DynamicSettings>
      )}
    </Stack>
  );
};
