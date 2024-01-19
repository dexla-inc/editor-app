import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import {
  debouncedTreeComponentAttrsUpdate,
  debouncedTreeUpdate,
  getComponentById,
} from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useMemo } from "react";
import get from "lodash.get";
import { useEditorStore } from "@/stores/editor";

export const TextData = ({ component, endpoints }: DataProps) => {
  const editorTree = useEditorStore((state) => state.tree);
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";
  const { getSelectedVariable } = useBindingPopover();
  const parentDataComponent = getComponentById(
    editorTree.root,
    component.parentDataComponentId,
  );
  const parentEndpoint = endpoints?.results?.find(
    (e) => e.id === parentDataComponent?.onLoad.endpointId,
  );

  const itemKey = isNavLink ? "label" : isFileButton ? "name" : "children";

  const form = useForm({
    initialValues: {
      [itemKey]: component.props?.[itemKey] ?? "",
      hideIfDataIsEmpty: component.props?.hideIfDataIsEmpty ?? false,
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
      dataType: component.props?.dataType ?? "static",
      variable: component.props?.variable ?? "",
      initiallyOpened: true,
    },
  });

  const onLoadForm = useForm({
    initialValues: {
      dataValueKey: component.onLoad?.dataValueKey ?? "",
    },
  });

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  const setOnLoadFormFieldValue = (attrs: any) => {
    onLoadForm.setValues(attrs);
    debouncedTreeComponentAttrsUpdate({ onLoad: attrs });
  };

  const selectableObject = useMemo(
    () =>
      parentDataComponent?.onLoad?.resultsKey
        ? get(
            JSON.parse(parentEndpoint?.exampleResponse || "{}"),
            parentDataComponent?.onLoad?.resultsKey,
          )
        : JSON.parse(parentEndpoint?.exampleResponse || "{}"),
    [parentEndpoint?.exampleResponse, parentDataComponent?.onLoad?.resultsKey],
  );

  const selectableObjectKeys = useMemo(
    () =>
      Object.keys(
        Array.isArray(selectableObject)
          ? selectableObject[0]
          : selectableObject,
      ),
    [selectableObject],
  );

  const selectedVariable = getSelectedVariable(form.values.variable);

  const handleValueUpdate = () => {
    if (selectedVariable) {
      setFieldValue(itemKey, selectedVariable.defaultValue);
    }
  };

  useEffect(() => {
    handleValueUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.variable, selectedVariable]);

  return (
    <form>
      <Stack spacing="xs">
        <Select
          label="Value"
          data={selectableObjectKeys}
          {...onLoadForm.getInputProps("dataValueKey")}
          onChange={(selected) => {
            setOnLoadFormFieldValue({ dataValueKey: selected });
          }}
        />

        <ComponentToBindFromInput
          componentId={component?.id!}
          onPickVariable={(variable: string) =>
            form.setFieldValue("variable", variable)
          }
          category="data"
          actionData={[]}
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) =>
            setFieldValue(`actionCode`, {
              ...form.values.actionCode,
              [label]: javascriptCode,
            })
          }
          size="xs"
          label="Value"
          {...form.getInputProps(itemKey)}
          onChange={(e) => setFieldValue(itemKey, e.currentTarget.value)}
        />

        <VisibilityModifier
          componentId={component.id!}
          componentName={component.name}
          form={form}
        />
      </Stack>
    </form>
  );
};
