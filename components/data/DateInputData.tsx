import { DataProps } from "@/types/dataBinding";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { ICON_SIZE } from "@/utils/config";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
import { ValueProps } from "@/types/dataBinding";
import merge from "lodash.merge";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { BindingField } from "@/components/editor/BindingField/BindingField";

const fields = [
  {
    name: "value",
    label: "Value",
    fieldType: "Text",
    type: "date",
  },
];

export const DateInputData = ({ component, endpoints }: DataProps) => {
  const hasParentComponentData = useEditorTreeStore((state) =>
    state.selectedComponentIds?.at(-1)?.includes("-related-"),
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
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({
        attrs: form.values,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing="xs">
      <ComponentToBindFromInput<"Segmented">
        fieldType="Segmented"
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
      >
        {" "}
        <ComponentToBindFromInput.Segmented />{" "}
      </ComponentToBindFromInput>
      <ComponentToBindFromInput<"Select">
        label="Format"
        fieldType="Select"
        data={[
          { label: "DD MMM YYYY", value: "DD MMM YYYY" },
          { label: "DD MM YYYY", value: "DD MM YYYY" },
          { label: "MM DD YYYY", value: "MM DD YYYY" },
          { label: "DD MMM", value: "DD MMM" },
          { label: "DD MMM YY", value: "DD MMM YY" },
          { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
          { label: "YYYY-MMM-DD", value: "YYYY-MMM-DD" },
        ]}
        placeholder="Select format"
        {...form.getInputProps("onLoad.valueFormat")}
      >
        <ComponentToBindFromInput.Select />
      </ComponentToBindFromInput>
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
                <BindingField
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
        {/* <FormFieldsBuilder
        fields={fields}
        component={component}
        endpoints={endpoints!}
      /> */}
        <VisibilityModifier form={form} />
        <ComponentToBindFromInput<"Select">
          size="xs"
          label="State"
          {...form.getInputProps(`onLoad.currentState`)}
          data={getComponentsStates()}
          fieldType="Select"
        >
          <ComponentToBindFromInput.Select />
        </ComponentToBindFromInput>
      </>
    </Stack>
  );
};
