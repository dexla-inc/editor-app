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
      label: "HTML",
      fieldType: "TextArea" as const,
    },
    {
      name: "cssCode",
      label: "CSS",
      fieldType: "TextArea" as const,
    },
    {
      name: "jsCode",
      label: "JavaScript",
      fieldType: "TextArea" as const,
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
