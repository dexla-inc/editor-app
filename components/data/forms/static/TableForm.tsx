import { MonacoEditorJson } from "@/components/MonacoEditorJson";
import { safeJsonParse } from "@/utils/common";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";

const TableFormComponent = ({ component }: { component: Component }) => {
  const form = useForm({
    initialValues: {
      props: {
        data: component.props?.data ?? defaultData,
        style: {
          display: component.props?.style?.display,
        },
      },
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack>
      <MonacoEditorJson
        height="700px"
        {...(true
          ? {
              value: form.values.props.data
                ? safeJsonParse(form.values.props.data)
                : "",
              onChange: (value: any) => {
                form.setFieldValue(
                  "props.data",
                  JSON.stringify(value, null, 2) ?? "",
                );
              },
            }
          : {
              value: form.values.props.data,
              onChange: (value: any) => {
                form.setFieldValue("props.data", value ?? "");
              },
            })}
      />
    </Stack>
  );
};

// Needs to be like this otherwise the parser errors
const defaultData = `[
  {
    "name": "Angelique Morse",
    "phoneNumber": "500-268-4826",
    "company": "Wuckert Inc",
    "status": "Banned",
  },
  {
    "name": "Ariana Lang",
    "phoneNumber": "408-439-8033",
    "company": "Feest Group",
    "status": "Pending",
  },
]`;

export const TableForm = React.memo(
  TableFormComponent,
  (prevProps, nextProps) => {
    // Implement custom comparison if needed, for now, it's doing a shallow compare by default
    return prevProps.component === nextProps.component;
  },
);

// Paste in Static data for testing
// [
//   {
//     "name": "Angelique Morse",
//     "phoneNumber": "500-268-4826",
//     "company": "Wuckert Inc",
//     "status": "Banned"
//   },
//   {
//     "name": "Ariana Lang",
//     "phoneNumber": "408-439-8033",
//     "company": "Feest Group",
//     "status": "Pending"
//   }
// ]
