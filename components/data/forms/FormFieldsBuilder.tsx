import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { useComponentStates } from "@/hooks/useComponentStates";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { ICON_SIZE } from "@/utils/config";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { ValueProps } from "@/utils/types";
import { ActionIcon, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

type Props = {
  fields: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    additionalComponent?: JSX.Element;
  }>;
  endpoints: PagingResponse<Endpoint>;
  component: Component;
};

export const FormFieldsBuilder = ({ component, fields, endpoints }: Props) => {
  const hasParentComponentData = component.parentDataComponentId;
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

  const form = useForm({
    initialValues: {
      onLoad: merge({}, onLoadFieldsStarter, component?.onLoad),
      props: {
        style: {
          display: component.props?.style?.display,
        },
      },
    },
  });

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate(form.values);
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
            form.values.onLoad[field].dataType === "static"
              ? "dynamic"
              : "static",
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
          <Group
            key={f.name}
            noWrap
            align="flex-end"
            spacing={10}
            grow={!hasParentComponentData}
          >
            {!isDynamic && (
              <StaticFormFieldsBuilder
                field={f}
                form={form}
                component={component}
              />
            )}
            {isDynamic && (
              <DynamicFormFieldsBuilder
                form={form}
                component={component}
                endpoints={endpoints}
                field={f}
              />
            )}
            {hasParentComponentData && (
              <ActionIcon
                onClick={() => onClickToggleDataType(f.name)}
                variant="default"
              >
                <DataTypeIcon size={ICON_SIZE} />
              </ActionIcon>
            )}
          </Group>
        );
      })}
      <VisibilityModifier
        componentId={component.id!}
        componentName={component.name}
        form={form}
      />
      <ComponentToBindFromSelect
        size="xs"
        label="State"
        {...form.getInputProps(`onLoad.currentState`)}
        data={getComponentsStates()}
      />
    </>
  );
};
