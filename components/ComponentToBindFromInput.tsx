import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Group, TextInput, TextInputProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useState } from "react";
import BindingPopover from "./BindingPopover";

type Props = TextInputProps & {
  componentId?: string;
  bindAttributes?: Record<string, string>;
  index?: number;
  onPickComponent?: (value: string) => void;
  onPickVariable?: (value: string) => void;
  isLogicFlow?: boolean;
};

export const ComponentToBindFromInput = ({
  componentId,
  index,
  onPickComponent,
  onPickVariable,
  bindAttributes,
  placeholder = "",
  label = "Component to bind",
  isLogicFlow,
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

  const [bindedValue, setBindedValue] = useState("");
  const [
    opened,
    { toggle: onTogglePopover, close: onClosePopover, open: onOpenPopover },
  ] = useDisclosure(false);
  const [javaScriptCode, setJavaScriptCode] = useState("");

  return (
    <TextInput
      size="xs"
      placeholder={placeholder}
      label={label}
      onFocus={(e) => {
        setHighlightedComponentId(e.target.value);
      }}
      onBlur={() => {
        setHighlightedComponentId(null);
      }}
      rightSection={
        <Group noWrap spacing={0}>
          <BindingPopover
            opened={opened}
            onTogglePopover={onTogglePopover}
            onClosePopover={onClosePopover}
            bindingType="JavaScript"
            onChangeBindingType={() => {}}
            javascriptCode={javaScriptCode}
            onChangeJavascriptCode={(javascriptCode: any) =>
              setJavaScriptCode(javascriptCode)
            }
            onOpenPopover={onOpenPopover}
            bindedValue={bindedValue}
            onPickComponent={onPickComponent}
            onPickVariable={onPickVariable}
          />
          {onPickComponent && !isLogicFlow && (
            <>
              <ActionIcon onClick={onBindComponent} size="xs">
                <IconCurrentLocation size={ICON_SIZE} />
              </ActionIcon>
            </>
          )}
        </Group>
      }
      styles={{
        input: { paddingRight: "3.65rem" },
        ...(!isLogicFlow && { rightSection: { width: "3.65rem" } }),
      }}
      {...rest}
      onChange={(e) => {
        setBindedValue(e.target.value);
        if (rest?.onChange) rest.onChange(e);
      }}
    />
  );
};
