import { DataProps } from "@/components/data/type";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import {
  debouncedTreeComponentAttrsUpdate,
  getParentComponentData,
} from "@/utils/editor";
import { useForm } from "@mantine/form";
import { ComponentToBindFromSelect } from "@/components/ComponentToBindFromSelect";
import { useEffect } from "react";
import { ComponentToBindFromSegmentedControl } from "@/components/ComponentToBindFromSegmentedControl";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { ICON_SIZE } from "@/utils/config";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useComponentStates } from "@/hooks/useComponentStates";
import { ValueProps } from "@/types/dataBinding";
import merge from "lodash.merge";
import { useDataBinding } from "@/hooks/dataBinding/useDataBinding";

export const DateInputData = ({ component, endpoints }: DataProps) => {
  const fields = [
    {
      name: "value",
      label: "Value",
      type: "date",
    },
  ];

  const editorTree = useEditorTreeStore((state) => state.tree);
  const { computeValue } = useDataBinding();
  const hasParentComponentData = !!getParentComponentData(
    editorTree.root,
    component.id!,
    endpoints!,
    computeValue,
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

  const onLoadValues = merge({}, onLoadFieldsStarter, component?.onLoad);

  const form = useForm({
    initialValues: {
      onLoad: {
        ...onLoadValues,
        value: component?.onLoad?.value,
        type: component?.onLoad?.type,
        valueFormat: component?.onLoad?.valueFormat,
      },
      props: {
        style: {
          display: component.props?.style?.display,
        },
      },
    },
  });

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

  useEffect(() => {
    if (form.isTouched() && form.isDirty()) {
      debouncedTreeComponentAttrsUpdate({
        attrs: form.values,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing="xs">
      <ComponentToBindFromSegmentedControl
        label="Type"
        data={[
          {
            label: "Default",
            value: "default",
          },
          {
            label: "Multiple",
            value: "multiple",
          },
          {
            label: "Range",
            value: "range",
          },
        ]}
        {...form.getInputProps("onLoad.type")}
      />
      <ComponentToBindFromSelect
        label="Format"
        data={[
          { label: "DD MMM YYYY", value: "DD MMM YYYY" },
          { label: "DD MM YYYY", value: "DD MM YYYY" },
          { label: "MM DD YYYY", value: "MM DD YYYY" },
          { label: "DD MMM", value: "DD MMM" },
          { label: "DD MMM YY", value: "DD MMM YY" },
          // { label: "DD-DD MMM, YYYY", value: "DD-DD MMM, YYYY" },
        ]}
        placeholder="Select format"
        {...form.getInputProps("onLoad.valueFormat")}
      />
      <>
        {fields.map((f) => {
          const isDynamic =
            form.values.onLoad?.[f.name]?.dataType === "dynamic";
          const DataTypeIcon = isDynamic ? IconPlugOff : IconPlug;

          // @ts-ignore
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
                  endpoints={endpoints!}
                  field={f}
                />
              ) : (
                <StaticFormFieldsBuilder
                  // @ts-ignore
                  field={f}
                  form={form}
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
        <VisibilityModifier form={form} />
        <ComponentToBindFromSelect
          size="xs"
          label="State"
          {...form.getInputProps(`onLoad.currentState`)}
          data={getComponentsStates()}
        />
      </>
    </Stack>
  );
};
