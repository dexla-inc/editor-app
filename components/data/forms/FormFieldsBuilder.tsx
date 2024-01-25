import { useForm } from "@mantine/form";
import { pick } from "next/dist/lib/pick";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { useEffect } from "react";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { ActionIcon, Group } from "@mantine/core";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { ICON_SIZE } from "@/utils/config";
import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { PagingResponse } from "@/requests/types";
import { Endpoint } from "@/requests/datasources/types";

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

  const customFields = Object.entries(
    pick(
      component.onLoad ?? {},
      fields.map((f) => f.name),
    ),
  ).reduce((acc, [key, value]) => {
    if (hasParentComponentData) {
      acc[key] = {
        dataType: "dynamic",
        value: value?.value,
      };
    } else {
      acc[key] = {
        dataType: value?.dataType ?? "static",
        value: value.value,
      };
    }
    return acc;
  }, {} as any);

  const form = useForm({
    initialValues: {
      onLoad: {
        ...component?.props?.onLoad,
        ...customFields,
      },
      props: {
        actionCode: component.props?.actionCode ?? {},
        variable: component.props?.variable ?? "",
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
        const isStatic = form.values.onLoad[f.name]?.dataType === "static";
        const DataTypeIcon = isStatic ? IconPlug : IconPlugOff;

        return (
          <Group
            key={f.name}
            noWrap
            align="flex-end"
            spacing={10}
            grow={!hasParentComponentData}
          >
            {isStatic && (
              <StaticFormFieldsBuilder
                field={f}
                form={form}
                component={component}
              />
            )}
            {!isStatic && (
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
    </>
  );
};
