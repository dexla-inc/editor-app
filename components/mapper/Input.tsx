import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import {
  ActionIcon,
  Group,
  TextInput as MantineInput,
  NumberInput as MantineNumberInput,
  NumberInputProps,
  PasswordInput,
  TextInputProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo, useCallback, useState } from "react";
import { InputLoader } from "../InputLoader";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NumberInputProps &
  TextInputProps;

const InputComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const iframeWindow = useEditorStore((state) => state.iframeWindow);
    const {
      children,
      icon,
      triggers,
      value,
      loading,
      clearable,
      bg,
      textColor,
      ...componentProps
    } = component.props as any;
    const { name: iconName } = icon && icon!.props!;
    const { type, ...restComponentProps } = componentProps;
    const theme = useEditorStore((state) => state.theme);
    const backgroundColor = getColorFromTheme(theme, bg) ?? "white";
    const color = getColorFromTheme(theme, textColor) ?? "black";

    const _defaultValue = type === "number" || type === "numberRange" ? 0 : "";
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setStoreInputValue = useInputsStore((state) => state.setInputValue);

    const [localInputValue, setLocalInputValue] = useState(
      inputValue ?? _defaultValue,
    );

    const isClearable = clearable && !!inputValue;

    // clear input field
    const clearInput = () => {
      setLocalInputValue(_defaultValue);
      setStoreInputValue(component.id!, _defaultValue);
      const el = iframeWindow?.document.getElementById(component.id!);
      el?.focus();
    };

    // update values in store
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
      debounce((value) => {
        setStoreInputValue(component.id!, value);
      }, 400),
      [component.id],
    );

    // handle changes to input field
    const handleInputChange = (e: any) => {
      let newValue = e.target ? e.target.value : e;
      if (type === "number") {
        newValue = newValue ? Number(newValue) : 0;
      }
      setLocalInputValue(newValue);
      debouncedOnChange(newValue);
      triggers?.onChange && triggers?.onChange(e);
    };

    // handle increase number range
    const increaseNumber = () => {
      let val = localInputValue;
      if (val === undefined) val = 1;
      else val += 1;
      handleInputChange(val);
    };

    // handle decrease number range
    const decreaseNumber = () => {
      let val = localInputValue;
      if (val === undefined) val = -1;
      else val -= 1;
      handleInputChange(val);
    };

    const parseToNumber = (value: any) => {
      const number = Number(value);
      return isNaN(number) ? 0 : number;
    };

    const customStyle = merge({}, props.style, { backgroundColor, color });

    return (
      <>
        {type === "numberRange" ? (
          <>
            <Group
              spacing={0}
              {...props}
              style={{
                ...customStyle,
                position: "relative",
              }}
            >
              <ActionIcon
                size={props.size}
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
                {...restComponentProps}
                styles={{
                  root: {
                    display: "inline",
                    flex: "1 !important",
                    width: "min-content",
                  },
                  input: {
                    border: "none",
                    textAlign: "center",
                    height: customStyle.height,
                    backgroundColor,
                    color,
                  },
                }}
                size={props.size}
                value={parseToNumber(localInputValue)}
                onChange={handleInputChange}
                label={undefined}
              />

              <ActionIcon
                size={props.size}
                variant="transparent"
                style={{ border: "none" }}
                onClick={increaseNumber}
              >
                +
              </ActionIcon>
            </Group>
          </>
        ) : type === "number" ? (
          <MantineNumberInput
            {...props}
            {...restComponentProps}
            ref={ref}
            autoComplete="off"
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            style={{}}
            styles={{
              root: {
                position: "relative",
                ...pick(customStyle, [
                  "display",
                  "width",
                  "height",
                  "minHeight",
                  "minWidth",
                ]),
              },
              input: customStyle,
            }}
            min={0}
            value={parseToNumber(localInputValue)}
            onChange={handleInputChange}
            rightSection={loading ? <InputLoader /> : null}
            label={undefined}
          />
        ) : type === "password" ? (
          <PasswordInput
            {...props}
            {...restComponentProps}
            ref={ref}
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            styles={{
              root: {
                position: "relative",
                ...pick(customStyle, [
                  "display",
                  "width",
                  "height",
                  "minHeight",
                  "minWidth",
                ]),
              },
              input: customStyle,
              innerInput: { color },
            }}
            value={localInputValue}
            onChange={handleInputChange}
            rightSection={
              loading ? (
                <InputLoader />
              ) : isClearable ? (
                <Icon onClick={clearInput} name="IconX" />
              ) : null
            }
          />
        ) : (
          <MantineInput
            {...props}
            {...componentProps}
            ref={ref}
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            style={{}}
            styles={{
              root: {
                position: "relative",
                ...pick(customStyle, [
                  "display",
                  "width",
                  "height",
                  "minHeight",
                  "minWidth",
                ]),
              },
              input: customStyle,
            }}
            value={localInputValue}
            onChange={handleInputChange}
            rightSection={
              loading ? (
                <InputLoader />
              ) : isClearable ? (
                <Icon onClick={clearInput} name="IconX" />
              ) : null
            }
            label={undefined}
          />
        )}
      </>
    );
  },
);
InputComponent.displayName = "Input";

export const Input = memo(withComponentWrapper<Props>(InputComponent), isSame);
