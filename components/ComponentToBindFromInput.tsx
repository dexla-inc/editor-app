import BindingPopover, { useBindingPopover } from "@/components/BindingPopover";
import { useEditorStore } from "@/stores/editor";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
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
  onBindValue?: (value: string) => void;
  isLogicFlow?: boolean;
  javascriptCode?: Record<string, string>;
  onChangeJavascriptCode?: (javascriptCode: string, label: string) => void;
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
  onBindValue,
  ...rest
}: Props) => {
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

  // TODO: Williams, learn react custom hooks. More common logic may need to go in useBindingPopover.
  // Always think about reusability, one component should be responsible for one thing https://stackify.com/solid-design-principles/.
  const { opened, toggle, close, open } = useBindingPopover();

  const [bindedValue, setBindedValue] = useState("");
  const _jsCode = javascriptCode ?? {};
  const _code = _jsCode[label as string] ?? _jsCode.code ?? "";

  const onCodeChange = (javascriptCode: string) => {
    label = label === "Component to bind" ? "code" : label;
    onChangeJavascriptCode &&
      onChangeJavascriptCode(javascriptCode, label as string);
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
        onChange={(e) => {
          setBindedValue(e.target.value);
          if (rest?.onChange) rest.onChange(e);
        }}
        {...AUTOCOMPLETE_OFF_PROPS}
      />
      <BindingPopover
        opened={opened}
        onTogglePopover={toggle}
        onClosePopover={close}
        bindingType="JavaScript"
        onChangeBindingType={() => {}}
        javascriptCode={_code}
        onChangeJavascriptCode={onCodeChange}
        onOpenPopover={open}
        bindedValue={bindedValue}
        onPickComponent={onPickComponent}
        onPickVariable={onPickVariable}
        actionData={actionData}
        style="iconButton"
      />
    </Flex>
  );
};
