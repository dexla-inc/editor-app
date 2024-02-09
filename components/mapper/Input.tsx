import { Icon } from "@/components/Icon";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
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
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo } from "react";
import { InputLoader } from "../InputLoader";
import { PasswordInputWrapper } from "./PasswordInputWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: Boolean;
} & NumberInputProps &
  TextInputProps;

const InputComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref) => {
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
      size,
      ...componentProps
    } = component.props as any;
    const { name: iconName } = icon && icon!.props!;
    const { type, ...restComponentProps } = componentProps;
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const _defaultValue = type === "number" || type === "numberRange" ? 0 : "";
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setStoreInputValue = useInputsStore((state) => state.setInputValue);

    const isClearable = clearable && !!inputValue;

    const { borderStyle, inputStyle } = useBrandingStyles();

    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });

    // clear input field
    const clearInput = () => {
      setStoreInputValue(component.id!, _defaultValue);
      const el = iframeWindow?.document.getElementById(component.id!);
      el?.focus();
    };
    const handleInputChange = (e: any) => {
      let newValue = e.target ? e.target.value : e;
      if (type === "number") {
        newValue = newValue ? Number(newValue) : 0;
      }
      setStoreInputValue(component.id!, newValue);
      triggers?.onChange && triggers?.onChange(e);
    };

    // handle increase number range
    const increaseNumber = () => {
      let val = inputValue;
      if (val === undefined) val = 1;
      else val += 1;
      handleInputChange(val);
    };

    // handle decrease number range
    const decreaseNumber = () => {
      let val = inputValue;
      if (val === undefined) val = -1;
      else val -= 1;
      handleInputChange(val);
    };

    const parseToNumber = (value: any) => {
      const number = Number(value);
      return isNaN(number) ? 0 : number;
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
                    backgroundColor,
                    color,
                  },
                }}
                value={parseToNumber(inputValue)}
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
                  "minHeight",
                  "minWidth",
                ]),
                height: "fit-content",
              },
              input: customStyle,
            }}
            min={0}
            value={parseToNumber(inputValue)}
            onChange={handleInputChange}
            rightSection={loading ? <InputLoader /> : null}
            label={undefined}
          />
        ) : type === "password" ? (
          <PasswordInputWrapper
            value={inputValue}
            requirements={[]}
            isPreviewMode
          >
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
                  ...pick(customStyle, [
                    "display",
                    "width",
                    "minHeight",
                    "minWidth",
                  ]),
                  height: "fit-content",
                },
                input: customStyle,
                innerInput: { ...pick(customStyle, ["height"]), color },
              }}
              value={inputValue}
              onChange={handleInputChange}
              rightSection={
                loading ? (
                  <InputLoader />
                ) : isClearable ? (
                  <Icon onClick={clearInput} name="IconX" />
                ) : null
              }
            />
          </PasswordInputWrapper>
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
                  "minHeight",
                  "minWidth",
                ]),
                height: "fit-content",
              },
              input: customStyle,
            }}
            value={inputValue}
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
