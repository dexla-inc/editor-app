import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Modifiers, requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import React, { useEffect } from "react";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { SizeSelector } from "@/components/SizeSelector";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";

type Props = {
  selectedComponent: Component;
  children?: (props: any) => JSX.Element;
};
export const ModalDrawerFormBuilder = ({
  selectedComponent,
  children,
}: Props) => {
  const modifier = selectedComponent.name.toLowerCase() as Modifiers;
  const defaultFormProps = requiredModifiers[modifier] ?? {};
  const newFormProps = Object.fromEntries(
    Object.entries(defaultFormProps).map(([key, value]) => [
      key,
      selectedComponent.props?.[key] ?? value,
    ]),
  );

  const form = useForm();

  useEffect(() => {
    form.setValues(merge({}, defaultFormProps, newFormProps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const onChange = (key: string, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { [key]: value } },
    });
  };

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Title"
          size="xs"
          {...form.getInputProps("title")}
          onChange={(e) => {
            const value = e.target.value;
            onChange("title", value as string);
          }}
        />
        <SegmentedControlInput
          label="Heading Tag"
          data={[
            { label: "H1", value: "H1" },
            { label: "H2", value: "H2" },
            { label: "H3", value: "H3" },
            { label: "H4", value: "H4" },
            { label: "H5", value: "H5" },
            { label: "H6", value: "H6" },
          ]}
          {...form.getInputProps("titleTag")}
          onChange={(value) => onChange("titleTag", value)}
        />
        <SizeSelector
          label="Size"
          showFullscreen
          {...form.getInputProps("size")}
          onChange={(value) => onChange("size", value as string)}
        />
        {children && children({ form, onChange })}
        <SegmentedControlYesNo
          label="Include Header"
          {...form.getInputProps("withCloseButton")}
          onChange={(value) => {
            form.setFieldValue("withCloseButton", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  withCloseButton: value,
                  // Only want to do this if false
                  ...(value === false && { title: " " }),
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
};
