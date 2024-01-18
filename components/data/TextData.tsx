import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

export const TextData = ({ component, endpoints }: DataProps) => {
  const isNavLink = component.name === "NavLink";
  const isFileButton = component.name === "FileButton";

  const itemKey = isNavLink ? "label" : isFileButton ? "name" : "children";

  const form = useForm({
    initialValues: {
      [itemKey]: component.props?.[itemKey] ?? "",
      hideIfDataIsEmpty: component.props?.hideIfDataIsEmpty ?? false,
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
      dataType: component.props?.dataType ?? "static",
      initiallyOpened: true,
    },
  });

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  return (
    <form>
      <Stack spacing="xs">
        <ComponentToBindFromInput
          componentId={component?.id!}
          onPickVariable={(variable: string) =>
            setFieldValue(itemKey, variable)
          }
          actionData={[]}
          javascriptCode={form.values.actionCode}
          onChangeJavascriptCode={(javascriptCode: string, label: string) =>
            setFieldValue(`actionCode.${label}`, javascriptCode)
          }
          size="xs"
          label="Value"
          {...form.getInputProps(itemKey)}
          onChange={(e) => setFieldValue(itemKey, e.currentTarget.value)}
        />

        <VisibilityModifier
          component={component}
          form={form}
          debouncedTreeUpdate={debouncedTreeUpdate}
        />
      </Stack>
    </form>
  );
};
