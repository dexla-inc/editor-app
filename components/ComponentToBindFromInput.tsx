import { useEditorStore } from "@/stores/editor";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Group, TextInput, TextInputProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { ChangeEvent, useState } from "react";
import BindingPopover from "./BindingPopover";

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

  const [bindingType, setBindingType] = useState("Component");
  const [bindedValue, setBindedValue] = useState("");
  const [
    opened,
    { toggle: onTogglePopover, close: onClosePopover, open: onOpenPopover },
  ] = useDisclosure(false);
  const [javaScriptCode, setJavaScriptCode] = useState("return ");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isSingleAtSign = e.target.value === "@";
    const isDoubleAtSign = e.target.value === "@@";
    if (!isSingleAtSign || !isDoubleAtSign) return;
    setBindingType(isSingleAtSign ? "Component" : "Variable");
    setBindedValue(e.target.value);
  };

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
      value={bindedValue}
      onChange={handleChange}
      rightSection={
        <Group noWrap spacing={0}>
          <BindingPopover
            opened={opened}
            onTogglePopover={onTogglePopover}
            onClosePopover={onClosePopover}
            bindingType={bindingType}
            onChangeBindingType={(bindingType: any) =>
              setBindingType(bindingType)
            }
            javascriptCode={javaScriptCode}
            onChangeJavascriptCode={(javascriptCode: any) =>
              setJavaScriptCode(javascriptCode)
            }
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
        // rightSection: { width: "3.65rem" },
      }}
      {...rest}
    />
  );
};
