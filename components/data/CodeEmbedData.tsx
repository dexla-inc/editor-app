import { FormFieldsBuilder } from "@/components/data/forms/FormFieldsBuilder";
import { Endpoint } from "@/requests/datasources/types";
import { DataType } from "@/types/dataBinding";
import { Component } from "@/utils/editor";

export type DataProps = {
  component: Component;
  endpoints: Endpoint[] | undefined;
  dataType: DataType;
};

export const CodeEmbedData = ({
  component,
  endpoints,
  dataType,
}: DataProps) => {
  const staticFields = [
    {
      name: "htmlCode",
      label: "HTML Code",
      fieldType: "CustomJs" as const,
      language: "html",
    },
  ];

  return (
    <FormFieldsBuilder
      fields={staticFields}
      component={component}
      endpoints={endpoints!}
    />
  );
};
