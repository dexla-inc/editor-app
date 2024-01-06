import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Group, TextInput, TextInputProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import BindingPopover, { BindingTab } from "./BindingPopover";

type Props = TextInputProps & {
  componentId?: string;
  bindAttributes?: Record<string, string>;
  index?: number;
  onPickComponent?: (value: string) => void;
  onPickVariable?: (value: string) => void;
};

export const ComponentToBindFromInput = ({
  componentId,
  index,
  onPickComponent,
  onPickVariable,
  bindAttributes,
  placeholder = "",
  label = "Component to bind",
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

  const [bindingTab, setBindingTab] = useState<BindingTab>("components");
  const [bindedValue, setBindedValue] = useState("");
  const [
    opened,
    { toggle: onTogglePopover, close: onClosePopover, open: onOpenPopover },
  ] = useDisclosure(false);
  const [javaScriptCode, setJavaScriptCode] = useState("return ");

  const handleBinder = useCallback(() => {
    const isSingleAtSign = bindedValue === "@";
    const isDoubleAtSign = bindedValue === "@@";
    if (!isSingleAtSign && !isDoubleAtSign) return;
    setBindingTab(isSingleAtSign ? "components" : "variables");
  }, [bindedValue]);

  useEffect(() => {
    handleBinder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bindedValue]);

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
            bindingTab={bindingTab}
            bindingType="JavaScript"
            onChangeBindingType={() => {}}
            javascriptCode={javaScriptCode}
            onChangeJavascriptCode={(javascriptCode: any) =>
              setJavaScriptCode(javascriptCode)
            }
            onOpenPopover={onOpenPopover}
            bindedValue={bindedValue}
            onPickComponent={onPickComponent}
          />
          {onPickComponent && (
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
        rightSection: { width: "3.65rem" },
      }}
      {...rest}
      onChange={(e) => setBindedValue(e.target.value)}
    />
  );
};
