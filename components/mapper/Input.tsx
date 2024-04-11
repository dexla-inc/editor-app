import { Icon } from "@/components/Icon";
import { InputLoader } from "@/components/InputLoader";
import { PasswordInput } from "@/components/mapper/PasswordInput";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
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
import { forwardRef, memo, useEffect } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputValue } from "@/hooks/useInputValue";
import { memoize } from "proxy-memoize";

type Props = EditableComponentMapper & NumberInputProps & TextInputProps;

const InputComponent = forwardRef(
  (
    { component, isPreviewMode, id, shareableContent, ...props }: Props,
    ref,
  ) => {
    const iframeWindow = useEditorStore((state) => state.iframeWindow);
    const updateTreeComponentAttrs = useEditorTreeStore(
      (state) => state.updateTreeComponentAttrs,
    );

    const {
      children,
      error,
      type,
      icon,
      triggers,
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

    const { onChange, ...restTriggers } = triggers || {};
    const { name: iconName } = icon && icon!.props!;
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const _defaultValue = type === "number" || type === "numberRange" ? 0 : "";

    const { borderStyle, inputStyle } = useBrandingStyles();

    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
    );

    const [value, setValue] = useInputValue(
      {
        value: onLoad?.value ?? "",
      },
      component.id!,
    );

    const newError = !value.length && error ? error : undefined;

    const isClearable = clearable && !!value;
    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });
    const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

    // clear input field
    const clearInput = async () => {
      await updateTreeComponentAttrs({
        componentIds: [component.id!],
        attrs: {
          onLoad: { value: { static: _defaultValue, dataType: "static" } },
        },
        save: false,
      });
      const el = iframeWindow?.document.getElementById(component.id!);
      el?.focus();
    };

    // handle increase number range
    const increaseNumber = () => {
      let val = value;
      if (val === undefined) val = 1;
      else val += 1;
      handleChange(val);
    };

    // handle decrease number range
    const decreaseNumber = () => {
      let val = value;
      if (val === undefined) val = -1;
      else val -= 1;
      handleChange(val);
    };

    const parseToNumber = (value: any) => {
      const number = Number(value);
      return isNaN(number) ? 0 : number;
    };

    const handleChange = async (e: any) => {
      let newValue = e.target ? e.target.value : e;
      if (type === "number") {
        newValue = newValue ? Number(newValue) : 0;
      }
      setValue(newValue);
    };

    // TODO: Move to a hook. Doing this as we need to update input immediately but not call actions etc.
    useEffect(() => {
      // Set a timeout to delay the call to onChange
      const timer = setTimeout(() => {
        if (onChange) {
          onChange();
        }
      }, 200);

      // Cleanup function to clear the timeout if the component unmounts or if value changes
      return () => clearTimeout(timer);
    }, [value, onChange]);

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
                position: "relative",
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
                    display: "inline",
                    flex: "1 !important",
                    width: "min-content",
                    height: customStyle.height,
                  },
                  wrapper: { height: "inherit" },
                  input: {
                    border: "none",
                    textAlign: "center",
                    backgroundColor,
                    color,
                    padding: "0px",
                    minHeight: "auto",
                    height: "inherit",
                  },
                }}
                value={parseToNumber(value)}
                {...restTriggers}
                onChange={handleChange}
                label={undefined}
                wrapperProps={{ "data-id": component.id }}
              />

              <ActionIcon
                size={customStyle.height}
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
            {...componentProps}
            ref={ref}
            autoComplete="off"
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            style={{}}
            styles={{
              root: {
                position: "relative",
                ...pick(customStyle, rootStyleProps),
                height: "fit-content",
              },
              input: { ...customStyle, minHeight: "auto" },
            }}
            min={0}
            value={parseToNumber(value)}
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
            componentProps={{ ...componentProps, error: newError }}
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
              root: {
                position: "relative",
                ...pick(customStyle, rootStyleProps),
                height: "fit-content",
              },
              input: { ...customStyle, minHeight: "auto" },
            }}
            value={value}
            error={newError}
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

export const Input = memo(withComponentWrapper<Props>(InputComponent));
