import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Modifiers, requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import React, { useEffect } from "react";
import { SegmentedControlYesNo } from "@/components/SegmentedControlYesNo";
import { SegmentedControlSizes } from "../SegmentedControlSizes";
import { inputSizes } from "@/utils/defaultSizes";
import { toSnakeCase } from "@/utils/common";
import camelcase from "lodash.camelcase";

type Props = {
  selectedComponent: Component;
  children?: (props: any) => JSX.Element;
};
export const CheckboxFormBuilder = ({ selectedComponent, children }: Props) => {
  const modifier = camelcase(selectedComponent.name) as Modifiers;
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

  // useEffect(() => {
  //   form.setValues(
  //     merge({}, requiredModifiers.checkbox, {
  //       size: selectedComponent.props?.size,
  //       withAsterisk: selectedComponent.props?.withAsterisk,

  //     }),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <SegmentedControlSizes
          label="Size"
          sizing={inputSizes}
          {...form.getInputProps("size")}
          onChange={(value) => onChange("size", value)}
        />
        <SegmentedControlYesNo
          label="Required"
          value={form.getInputProps("withAsterisk").value}
          onChange={(value) => onChange("withAsterisk", value)}
        />
        {children && children({ form, onChange })}
      </Stack>
    </form>
  );
};
