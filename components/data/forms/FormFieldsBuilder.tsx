import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import {
  FieldType,
  StaticFormFieldsBuilder,
} from "@/components/data/forms/StaticFormFieldsBuilder";
import { useComponentStates } from "@/hooks/useComponentStates";
import { Endpoint } from "@/requests/datasources/types";
import { PagingResponse } from "@/requests/types";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  getParentComponentData,
} from "@/utils/editor";
import { ActionIcon, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

type Props = {
  fields: Array<{
    name: string;
    label: string;
    type?: FieldType;
    placeholder?: string;
    additionalComponent?: JSX.Element;
    defaultValue?: any;
    decimalPlaces?: number;
  }>;
  endpoints: PagingResponse<Endpoint>;
  component: Component;
};

export const FormFieldsBuilder = ({ component, fields, endpoints }: Props) => {
  const tree = useEditorStore((state) => state.tree);
  const hasParentComponentData = !!getParentComponentData(
    tree.root,
    component.id!,
  );
  const { getComponentsStates } = useComponentStates();

  const onLoadFieldsStarter = fields.reduce((acc, f) => {
    // Handle special case for nested properties like 'center.lat'
    if (f.name.includes(".")) {
      const [parentKey, childKey] = f.name.split(".");
      // @ts-ignore
      acc[parentKey] = acc[parentKey] || {};
      // @ts-ignore
      acc[parentKey][childKey] = {
        static:
          component.onLoad?.[f.name]?.static ||
          component.props?.[f.name] ||
          f.defaultValue,
      };
    } else {
      // @ts-ignore
      acc[f.name] = {
        static:
          component.onLoad?.[f.name]?.static ||
          component.props?.[f.name] ||
          f.defaultValue,
      };
    }
    return acc;
  }, {});

  const onLoadValues = merge({}, onLoadFieldsStarter, component?.onLoad);

  const form = useForm({
    initialValues: {
      onLoad: onLoadValues,
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
            {isDynamic ? (
              <DynamicFormFieldsBuilder
                form={form}
                component={component}
                endpoints={endpoints}
                field={f}
              />
            ) : (
              <StaticFormFieldsBuilder
                field={f}
                form={form}
                component={component}
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
