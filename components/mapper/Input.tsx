import { Icon } from "@/components/Icon";
import { InputLoader } from "@/components/InputLoader";
import { PasswordInput } from "@/components/mapper/PasswordInput";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
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
import { forwardRef, memo, useEffect } from "react";

type Props = EditableComponentMapper & NumberInputProps & TextInputProps;

const InputComponent = forwardRef(
  (
    { component, isPreviewMode, id, shareableContent, ...props }: Props,
    ref,
  ) => {
    const iframeWindow = useEditorStore((state) => state.iframeWindow);
    console.log(component);
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
      passwordRange,
      passwordNumber,
      passwordLower,
      passwordUpper,
      passwordSpecial,
      displayRequirements,
      ...componentProps
    } = component.props as any;

    const { type, ...restComponentProps } = componentProps;
    const { onChange, ...restTriggers } = triggers || {};
    const { name: iconName } = icon && icon!.props!;
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const _defaultValue = type === "number" || type === "numberRange" ? 0 : "";
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setInputValue = useInputsStore((state) => state.setInputValue);

    const isClearable = clearable && !!inputValue;

    const { borderStyle, inputStyle } = useBrandingStyles();

    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });

    // clear input field
    const clearInput = () => {
      setInputValue(component.id!, _defaultValue);
      const el = iframeWindow?.document.getElementById(component.id!);
      el?.focus();
    };

    // handle increase number range
    const increaseNumber = () => {
      let val = inputValue;
      if (val === undefined) val = 1;
      else val += 1;
      handleChange(val);
    };

    // handle decrease number range
    const decreaseNumber = () => {
      let val = inputValue;
      if (val === undefined) val = -1;
      else val -= 1;
      handleChange(val);
    };

    const parseToNumber = (value: any) => {
      const number = Number(value);
      return isNaN(number) ? 0 : number;
    };

    const handleChange = (e: any) => {
      let newValue = e.target ? e.target.value : e;
      if (type === "number") {
        newValue = newValue ? Number(newValue) : 0;
      }
      setInputValue(component.id!, newValue);
    };

    // TODO: Move to a hook. Doing this as we need to update input immediately but not call actions etc.
    useEffect(() => {
      // Set a timeout to delay the call to onChange
      const timer = setTimeout(() => {
        if (onChange) {
          onChange();
        }
      }, 200);

      // Cleanup function to clear the timeout if the component unmounts or if inputValue changes
      return () => clearTimeout(timer);
    }, [inputValue, onChange]);

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
                {...restTriggers}
                onChange={handleChange}
                label={undefined}
                wrapperProps={{ "data-id": component.id }}
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
            {...restTriggers}
            onChange={handleChange}
            rightSection={loading ? <InputLoader /> : null}
            label={undefined}
            wrapperProps={{ "data-id": component.id }}
          />
        ) : type === "password" ? (
          <PasswordInput
            componentId={component?.id!}
            ref={ref}
            value={inputValue}
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
            restComponentProps={restComponentProps}
          />
        ) : (
          <MantineInput
            {...props}
            {...componentProps}
            ref={ref}
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
            {...restTriggers}
            onChange={handleChange}
            rightSection={
              loading ? (
                <InputLoader />
              ) : isClearable ? (
                <Icon onClick={clearInput} name="IconX" />
              ) : null
            }
            label={undefined}
            wrapperProps={{ "data-id": component.id }}
          />
        )}
      </>
    );
  },
);
InputComponent.displayName = "Input";

export const Input = memo(withComponentWrapper<Props>(InputComponent), isSame);
