import { Endpoint } from "@/requests/datasources/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import React, { useEffect } from "react";
import { FieldProps, ValueProps } from "@/types/dataBinding";
import has from "lodash.has";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
import { BindingField } from "@/components/editor/BindingField/BindingField";
import { unflattenObject } from "@/utils/common";
import get from "lodash.get";

type Props = {
  fields: FieldProps[];
  endpoints: Endpoint[];
  component: Component;
};

export const FormFieldsBuilder = ({ component, fields, endpoints }: Props) => {
  const { getComponentsStates } = useComponentStates();

  const commonFields: FieldProps[] = [
    {
      name: "isVisible",
      label: "Visibility",
      fieldType: "YesNo",
      defaultValue: true,
    },
    {
      name: "currentState",
      label: "State",
      fieldType: "Select",
      data: getComponentsStates(),
      defaultValue: "default",
    },
    {
      name: "tooltip",
      label: "Tooltip",
      fieldType: "Text",
    },
  ];

  // merging fields from forms to commonFields
  fields = [...fields, ...commonFields];
  const language = useEditorTreeStore((state) => state.language);

  const onLoadFieldsStarter = fields.reduce(
    (acc, f) => {
      // Require that I target the exact key in multiple levels case e.g. options.categories.x-axis
      const targetItem = get(component.onLoad, f.name, {});
      let staticValue = targetItem?.static;

      acc[f.name] = {
        static: {},
      };
      ["en", language].forEach((lang) => {
        const value = has(staticValue, lang)
          ? staticValue[lang]
          : has(staticValue, "en")
            ? // @ts-ignore
              staticValue.en
            : // if no translation key was found but it has the dataType attr, it means it was set before
              // (for backwards compatibility when we had no language)
              has(targetItem, "dataType")
              ? staticValue
              : // otherwise, return the value from props
                get(component.props, f.name, f.defaultValue ?? "");
        acc[f.name].static[lang] = value;
      });

      return acc;
    },
    {} as Record<string, ValueProps>,
  );

  const onLoadValues = merge({}, component?.onLoad, onLoadFieldsStarter);

  const form = useForm({
    initialValues: {
      onLoad: unflattenObject(onLoadValues),
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  useEffect(() => {
    form.setValues({ onLoad: unflattenObject(onLoadValues) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <>
      {fields.map((f) => {
        return (
          <Group key={f.name} noWrap align="flex-end" spacing={10} w="100%">
            <BindingField
              {...f}
              form={form}
              isTranslatable
              {...form.getInputProps(`onLoad.${f.name}`)}
            />
          </Group>
        );
      })}
    </>
  );
};
