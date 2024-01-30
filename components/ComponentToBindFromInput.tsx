import BindingPopover from "@/components/BindingPopover";
import { Category } from "@/hooks/useBindingPopover";
import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Flex, TextInput, TextInputProps } from "@mantine/core";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useState } from "react";

type Props = TextInputProps & {
  componentId?: string;
  bindAttributes?: Record<string, string>;
  index?: number;
  onPickComponent?: (value: string) => void;
  onPickVariable?: (value: string) => void;
  category?: Category;
  isLogicFlow?: boolean;
  javascriptCode?: Record<string, string> | string;
  onChangeJavascriptCode?: any;
  actionData?: any;
};

export const ComponentToBindFromInput = ({
  componentId,
  index,
  onPickComponent,
  onPickVariable,
  actionData,
  bindAttributes,
  placeholder = "",
  type = "text",
  label = "Component to bind",
  isLogicFlow,
  javascriptCode,
  onChangeJavascriptCode,
  category = "actions",
  ...rest
}: Props) => {
  console.log({ rest });
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setHighlightedComponentId = useEditorStore(
    (state) => state.setHighlightedComponentId,
  );

  const onBindComponent = () => {
    setPickingComponentToBindTo({
      componentId: componentId || "",
      onPick: onPickComponent,
    });
  };

  // const [bindedValue, setBindedValue] = useState("");
  const isChangeVariable = category === "changeVariable";
  let _code = "";
  if (javascriptCode)
    _code =
      typeof javascriptCode === "string"
        ? javascriptCode
        : javascriptCode[label as string] ?? javascriptCode.code ?? "";

  const passCodeToForm = (javascriptCode: string, func: any) => {
    if (isChangeVariable) func(javascriptCode);
    else func(javascriptCode, label as string);
  };

  const onCodeChange = (javascriptCode: string) => {
    label = label === "Component to bind" ? "code" : label;
    if (onChangeJavascriptCode) {
      passCodeToForm(javascriptCode, onChangeJavascriptCode);
    }
  };

  return (
    <Flex align="end" gap="xs">
      <TextInput
        size="xs"
        placeholder={placeholder}
        label={label}
        type={type}
        onFocus={(e) => {
          setHighlightedComponentId(e.target.value);
        }}
        onBlur={() => {
          setHighlightedComponentId(null);
        }}
        rightSection={
          onPickComponent &&
          !isLogicFlow && (
            <ActionIcon onClick={onBindComponent} size="xs">
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          )
        }
        styles={{
          ...(!isLogicFlow && {
            rightSection: { width: "3.65rem", justifyContent: "flex-end" },
          }),
        }}
        {...rest}
        // onChange={(e) => {
        //   // setBindedValue(e.target.value);
        //   if (rest?.onChange) rest.onChange(e);
        // }}
      />
      <BindingPopover
        bindingType="JavaScript"
        onChangeBindingType={() => {}}
        javascriptCode={_code}
        onChangeJavascriptCode={onCodeChange}
        bindedValue={rest.value}
        onPickComponent={onPickComponent}
        onPickVariable={onPickVariable}
        actionData={actionData}
        category={category}
        style="iconButton"
      />
    </Flex>
  );
};
