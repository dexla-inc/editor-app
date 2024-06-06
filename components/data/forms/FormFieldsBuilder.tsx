import { DynamicFormFieldsBuilder } from "@/components/data/forms/DynamicFormFieldsBuilder";
import { StaticFormFieldsBuilder } from "@/components/data/forms/StaticFormFieldsBuilder";
import { Endpoint } from "@/requests/datasources/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { ICON_SIZE } from "@/utils/config";
import { Component, debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlug, IconPlugOff } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { FieldProps, ValueProps } from "@/types/dataBinding";
import has from "lodash.has";
import { useComponentStates } from "@/hooks/editor/useComponentStates";

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
      type: "yesno",
    },
    {
      name: "currentState",
      label: "State",
      type: "select",
      data: getComponentsStates(),
    },
    {
      name: "tooltip",
      label: "Tooltip",
    },
  ];

  // merging fields from forms to commonFields
  fields = [...fields, ...commonFields];
  const language = useEditorTreeStore((state) => state.language);

  const hasParentComponentData = useEditorTreeStore((state) =>
    state.selectedComponentIds?.at(-1)?.includes("-related-"),
  );

  const onLoadFieldsStarter = fields.reduce(
    (acc, f) => {
      let staticValue = component.onLoad?.[f.name]?.static;

      // making sure the default language 'en' is always set
      acc[f.name] = {
        static: { ...(!has(staticValue, "en") && { en: "" }) },
      };

      // looking for translation keys, 'en' is the default key
      const value = has(staticValue, language)
        ? staticValue[language]
        : has(staticValue, "en")
          ? // @ts-ignore
            staticValue.en
          : // if no translation key was found but it has the dataType attr, it means it was set before
            // (for backwards compatibility when we had no language)
            has(component.onLoad?.[f.name], "dataType")
            ? staticValue
            : // otherwise, return the value from props
              component.props?.[f.name];
      acc[f.name].static[language] = value;

      return acc;
    },
    {} as Record<string, ValueProps>,
  );

  const onLoadValues = merge({}, component?.onLoad, onLoadFieldsStarter);

  const form = useForm({
    initialValues: {
      onLoad: onLoadValues,
    },
  });
  console.log(component, form.values);
  useEffect(() => {
    if (form.isTouched() && form.isDirty()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  useEffect(() => {
    form.setValues({ onLoad: onLoadValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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
    </>
  );
};
