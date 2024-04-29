import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import {
  FieldType,
  StaticFormFieldsBuilder,
} from "@/components/data/forms/StaticFormFieldsBuilder";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ICON_SIZE } from "@/utils/config";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { ValueProps } from "@/types/dataBinding";

type Props = {
  fields: Array<{
    name: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    additionalComponent?: JSX.Element;
    decimalPlaces?: number;
  }>;
  endpoints: PagingResponse<Endpoint>;
  component: Component;
};

export const FormFieldsBuilder = ({ component, fields, endpoints }: Props) => {
  const hasParentComponentData = useEditorTreeStore(
    (state) => state.selectedComponentIds?.at(-1)?.includes("-repeated-"),
  );
  const { getComponentsStates } = useComponentStates();

  const onLoadFieldsStarter = fields.reduce(
    (acc, f) => {
      acc[f.name] = {
        static: component.onLoad?.[f.name]?.static || component.props?.[f.name],
      };
      return acc;
    },
    {} as Record<string, ValueProps>,
  );

  const onLoadValues = merge(
    { currentState: { static: "default", dataType: "static" } },
    { isVisible: { static: true, dataType: "static" } },
    onLoadFieldsStarter,
    component?.onLoad,
  );

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
              <StaticFormFieldsBuilder field={f} form={form} />
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
      <VisibilityModifier form={form} />
      <ComponentToBindFromSelect
        size="xs"
        label="State"
        {...form.getInputProps(`onLoad.currentState`)}
        data={getComponentsStates()}
      />
    </>
  );
};
