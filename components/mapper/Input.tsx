import { Icon } from "@/components/Icon";
import { InputLoader } from "@/components/InputLoader";
import { PasswordInput } from "@/components/mapper/PasswordInput";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useEditorStore } from "@/stores/editor";
import { EditableComponentMapper } from "@/utils/editor";
import {
  ActionIcon,
  Group,
  TextInput as MantineInput,
  NumberInput as MantineNumberInput,
  NumberInputProps,
  TextInputProps,
} from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & NumberInputProps & TextInputProps;

const InputComponent = forwardRef(
  ({ component, id, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const patterns = {
      all: /^[\s\S]*$/,
      numbers: /^\d*$/,
      alphabets: /^[a-zA-Z\s]*$/,
    };
    const {
      children,
      type,
      icon,
      triggers,
      loading,
      clearable,
      bg,
      textColor,
      size,
      pattern,
      passwordRange,
      passwordNumber,
      passwordLower,
      passwordUpper,
      passwordSpecial,
      displayRequirements,
      ...restComponentProps
    } = component.props as any;

    const { placeholder = component.props?.placeholder } = component?.onLoad;

    const componentProps = { ...restComponentProps, placeholder };

    const { onChange, ...restTriggers } = triggers || {};
    const { name: iconName } = icon && icon!.props!;
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const _defaultValue = type === "number" || type === "numberRange" ? 0 : "";

    const { borderStyle, inputStyle } = useBrandingStyles();

    const [value, setValue] = useInputValue<string | number>(
      {
        value: component?.onLoad?.value ?? "",
      },
      id!,
    );

    const isClearable = clearable && !!value;
    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });
    const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

    // clear input field
    const clearInput = async () => {
      setValue(_defaultValue);
      const iframeWindow = useEditorStore.getState().iframeWindow;
      const currentWindow = iframeWindow ?? window;
      const inputElement = currentWindow.document.querySelector(
        `div[data-id="${component.id}"] input[type='text']`,
      ) as HTMLElement;
      inputElement?.focus();
    };

    // handle increase number range
    const increaseNumber = () => {
      let val = parseToNumber(value);
      if (typeof val !== "number") val = 1;
      else val += 1;
      handleChange(val);
    };

    // handle decrease number range
    const decreaseNumber = () => {
      let val = parseToNumber(value);
      if (typeof val === "number") val -= 1;
      handleChange(val);
    };

    const parseToNumber = (value: any) => {
      const isPrintableNumbers = /^(\d{1,3}(,\d{3})*(\.\d+)?|\d+)$/.test(value);
      return isPrintableNumbers ? Number(value) : "";
    };

    const handleChange = async (e: any) => {
      let newValue = e.target ? e.target.value : e;
      if (type === "number" || type === "numberRange") {
        newValue = parseToNumber(newValue);
      }
      setValue(newValue);
      if (onChange) {
        onChange(e);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const { altKey, ctrlKey, metaKey, shiftKey, key } = e;
      const isPrintable = key.length === 1;
      if (ctrlKey || shiftKey || altKey || metaKey) {
        return;
      }
      if (
        isPrintable &&
        !patterns[(pattern || "all") as keyof typeof patterns].test(e.key)
      ) {
        e.preventDefault();
      }
    };

    return (
      <>
        {type === "numberRange" ? (
          <>
            <Group
              spacing={0}
              {...props}
              style={{
                ...customStyle,
                overflow: "hidden",
                backgroundColor: "transparent",
                border: "none",
              }}
              id={id}
            >
              <div
                style={{
                  display: "flex",
                  gridArea: "1 / 1 / -1 / -1",
                  gap: "5px",
                }}
              >
                <ActionIcon
                  size={customStyle.height}
                  variant="transparent"
                  style={{ border: "none" }}
                  onClick={decreaseNumber}
                >
                  –
                </ActionIcon>

                <MantineNumberInput
                  hideControls
                  type="number"
                  autoComplete="off"
                  id={component.id}
                  {...componentProps}
                  style={{}}
                  styles={{
                    root: {
                      flex: 1,
                    },
                  }}
                  value={parseToNumber(value)}
                  {...restTriggers}
                  onChange={handleChange}
                  label={undefined}
                />

                <ActionIcon
                  size={customStyle.height}
                  variant="transparent"
                  style={{ border: "none" }}
                  onClick={increaseNumber}
                >
                  +
                </ActionIcon>
              </div>
            </Group>
          </>
        ) : type === "number" ? (
          <MantineNumberInput
            {...props}
            {...componentProps}
            ref={ref}
            autoComplete="off"
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            style={{}}
            styles={{
              root: customStyle,
              wrapper: {
                display: "flex",
                gridArea: "1 / 1 / -1 / -1",
              },
            }}
            min={0}
            value={parseToNumber(value)}
            {...restTriggers}
            onChange={handleChange}
            rightSection={loading ? <InputLoader /> : null}
            label={undefined}
            wrapperProps={{ "data-id": id }}
            onKeyDown={onKeyDown}
          />
        ) : type === "password" ? (
          <PasswordInput
            componentId={component?.id!}
            ref={ref}
            value={value}
            isPreviewMode={isPreviewMode}
            {...restTriggers}
            onChange={handleChange}
            displayRequirements={displayRequirements}
            testParameters={{
              passwordRange,
              passwordNumber,
              passwordLower,
              passwordUpper,
              passwordSpecial,
            }}
            iconComponent={Icon}
            iconName={iconName}
            color={color}
            customStyle={customStyle}
            props={props}
            componentProps={componentProps}
            rootStyleProps={rootStyleProps}
          />
        ) : (
          <MantineInput
            {...props}
            {...componentProps}
            ref={ref}
            icon={iconName ? <Icon name={iconName} /> : null}
            style={{}}
            styles={{
              root: customStyle,
              wrapper: {
                display: "flex",
                gridArea: "1 / 1 / -1 / -1",
              },
            }}
            value={value}
            {...restTriggers}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            rightSection={
              loading ? (
                <InputLoader />
              ) : isClearable ? (
                <Icon onClick={clearInput} name="IconX" />
              ) : null
            }
            label={undefined}
            wrapperProps={{ "data-id": id }}
          />
        )}
      </>
    );
  },
);
InputComponent.displayName = "Input";

export const Input = memo(withComponentWrapper<Props>(InputComponent));
