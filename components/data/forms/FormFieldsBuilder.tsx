import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { Endpoint } from "@/requests/datasources/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ICON_SIZE } from "@/utils/config";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import merge from "lodash.merge";
import React, { useEffect } from "react";
import { ValueProps } from "@/types/dataBinding";
import { CommonData } from "@/components/data/CommonData";
import {
  BindingField,
  FieldType,
} from "@/components/editor/BindingField/BindingField";

type Props = {
  fields: Array<{
    name: string;
    label: string;
    fieldType: FieldType;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    additionalComponent?: JSX.Element;
    precision?: number;
  }>;
  endpoints: Endpoint[];
  component: Component;
};

export const FormFieldsBuilder = ({ component, fields, endpoints }: Props) => {
  const hasParentComponentData = useEditorTreeStore((state) =>
    state.selectedComponentIds?.at(-1)?.includes("-related-"),
  );
  const onLoadFieldsStarter = fields.reduce(
    (acc, f) => {
      acc[f.name] = {
        static: component.onLoad?.[f.name]?.static || component.props?.[f.name],
      };
      return acc;
    },
    {} as Record<string, ValueProps>,
  );

  const onLoadValues = merge(onLoadFieldsStarter, component?.onLoad);

  const form = useForm({
    initialValues: {
      onLoad: onLoadValues,
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const onClickToggleDataType = (field: string) => {
    form.setTouched({ [`onLoad.${field}.dataType`]: true });
    form.setValues({
      onLoad: {
        ...form.values.onLoad,
        [String(field)]: {
          value: "",
          dataType:
            form.values.onLoad[field].dataType === "dynamic"
              ? "static"
              : "dynamic",
        },
      },
    });
  };

  return (
    <>
      {fields.map((f) => {
        const isDynamic = form.values.onLoad?.[f.name]?.dataType === "dynamic";
        const DataTypeIcon = isDynamic ? IconPlugOff : IconPlug;

        return (
          <Group key={f.name} noWrap align="flex-end" spacing={10} w="100%">
            {isDynamic ? (
              <DynamicFormFieldsBuilder
                form={form}
                component={component}
                endpoints={endpoints}
                field={f}
              />
            ) : (
              <BindingField
                {...f}
                form={form}
                {...form.getInputProps(`onLoad.${f.name}`)}
              />
            )}
            {hasParentComponentData && (
              <Tooltip label="Bind">
                <ActionIcon
                  onClick={() => onClickToggleDataType(f.name)}
                  variant="default"
                >
                  <DataTypeIcon size={ICON_SIZE} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        );
      })}
      <CommonData component={component} />
    </>
  );
};
