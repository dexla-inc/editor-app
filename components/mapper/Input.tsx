import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
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
      ...componentProps
    } = component.props as any;
    const { name: iconName } = icon && icon!.props!;
    // const type = (componentProps.type as string) || "text";
    const { type, ...restComponentProps } = componentProps;

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

    const customStyle = merge({}, props.style);

    return (
      <>
        {type === "numberRange" ? (
          <>
            <Group
              spacing={0}
              {...props}
              style={{
                background: "white",
                ...customStyle,
                position: "relative",
              }}
            >
              <ActionIcon
                size={props.size}
                variant="default"
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
                  },
                }}
                size={props.size}
                value={parseToNumber(localInputValue)}
                onChange={handleInputChange}
                label={undefined}
              />

              <ActionIcon
                size={props.size}
                variant="default"
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
                display: "block !important",
                width: customStyle.width,
                height: customStyle.height,
                minHeight: customStyle.minHeight,
                minWidth: customStyle.minWidth,
              },
              input: {
                ...customStyle,
                width: "-webkit-fill-available",
                height: "-webkit-fill-available",
                minHeight: "-webkit-fill-available",
                minWidth: "-webkit-fill-available",
              },
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
            style={{}}
            styles={{
              root: {
                position: "relative",
                display: "block !important",
                width: customStyle.width,
                minWidth: customStyle.minWidth,
              },
              input: {
                height: customStyle.height,
                minHeight: customStyle.minHeight,
                ...customStyle,
              },
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
                display: "block !important",
                width: customStyle.width,
                height: customStyle.height,
                minHeight: customStyle.minHeight,
                minWidth: customStyle.minWidth,
              },
              input: {
                ...customStyle,
                width: "-webkit-fill-available",
                height: "-webkit-fill-available",
                minHeight: "-webkit-fill-available",
                minWidth: "-webkit-fill-available",
              },
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
