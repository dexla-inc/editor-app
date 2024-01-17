import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { EndpointSelect } from "@/components/EndpointSelect";
import { SidebarSection } from "@/components/SidebarSection";
import { DataProps } from "@/components/data/type";
import { Endpoint } from "@/requests/datasources/types";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconDatabase } from "@tabler/icons-react";
import { useState } from "react";

export const AvatarData = ({ component, endpoints }: DataProps) => {
  const isImageComponent = component.name === "Image";
  const propsArray = isImageComponent ? ["src", "alt"] : ["children", "src"];
  const form = useForm({
    initialValues: {
      ...(!isImageComponent && { children: component.props?.children ?? "" }),
      ...(isImageComponent && { alt: component.props?.alt ?? "" }),
      src: component.props?.src ?? "",
      hideIfDataIsEmpty: component.props?.hideIfDataIsEmpty ?? false,
      endpoint: component.props?.endpoint ?? undefined,
      actionCode: component.props?.actionCode ?? {},
      initiallyOpened: false,
    },
  });

  const [selectedEndpoint, setSelectedEndpoint] = useState<
    Endpoint | undefined
  >(form.values.endpoint);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
  };

  return (
    <form>
      <Stack spacing="xs">
        {propsArray.map((key) => (
          <ComponentToBindFromInput
            key={key}
            componentId={component?.id!}
            onPickVariable={(variable: string) => setFieldValue(key, variable)}
            actionData={[]}
            javascriptCode={form.values.actionCode}
            onChangeJavascriptCode={(javascriptCode: string, label: string) =>
              setFieldValue(`actionCode.${label}`, javascriptCode)
            }
            size="xs"
            label={
              key === "children"
                ? "Value"
                : key === "alt"
                ? "Alternative Text"
                : "Source"
            }
            {...(key === "children" || key === "alt"
              ? {}
              : { placeholder: "https://example.com/image.png", type: "url" })}
            {...form.getInputProps(key)}
            onChange={(e) => setFieldValue(key, e.currentTarget.value)}
            {...AUTOCOMPLETE_OFF_PROPS}
          />
        ))}
        <SidebarSection
          id="data"
          initiallyOpened={form.values.initiallyOpened}
          label="Load Data"
          icon={IconDatabase}
          onClick={(id: string, opened: boolean) =>
            id === "data" && form.setFieldValue("initiallyOpened", opened)
          }
        >
          <EndpointSelect
            {...form.getInputProps("endpoint")}
            onChange={(selected) => {
              setFieldValue("endpoint", selected!);
              setSelectedEndpoint(
                endpoints?.results?.find((e) => e.id === selected),
              );
            }}
          />
          <TextInput size="xs" label="Results key" placeholder="user.list" />
        </SidebarSection>
      </Stack>
    </form>
  );
};
