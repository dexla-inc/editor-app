import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import {
  Loader,
  TextInput as MantineInput,
  NumberInput as MantineNumberInput,
  NumberInputProps,
  TextInputProps,
  Group,
  ActionIcon,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { forwardRef, memo, useCallback, useState } from "react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NumberInputProps &
  TextInputProps;

const InputComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const theme = useEditorStore((state) => state.theme);
    const borderColor = getColorFromTheme(theme, "Border.6");
    const { children, icon, triggers, value, loading, ...componentProps } =
      component.props as any;
    const { name: iconName } = icon && icon!.props!;
    const [inputValue, setInputValue] = useState(value);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
      debounce((e) => {
        triggers?.onChange(e);
      }, 400),
      [debounce],
    );

    const type = (componentProps.type as string) || "text";

    const customStyle = merge({}, { borderColor }, props.style);

    return (
      <>
        {type === "numberRange" ? (
          <>
            <Group
              spacing={0}
              {...props}
              styles={merge(
                {},
                {
                  root: { ...customStyle },
                },
              )}
            >
              <ActionIcon
                size={props.size}
                variant="default"
                style={{ border: "none" }}
                onClick={() => {
                  setInputValue((prev: number) => (!prev ? -1 : prev - 1));
                  triggers?.onChange && debouncedOnChange(value);
                }}
              >
                –
              </ActionIcon>

              <MantineNumberInput
                hideControls
                type="number"
                autoComplete="off"
                id={component.id}
                {...omit(componentProps, ["type"])}
                styles={{
                  root: { display: "inline", flexGrow: 1 },
                  input: { border: "none", textAlign: "center" },
                }}
                size={props.size}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e);
                  triggers?.onChange ? debouncedOnChange(e) : undefined;
                }}
                label={undefined}
              />

              <ActionIcon
                size={props.size}
                variant="default"
                style={{ border: "none" }}
                onClick={() => {
                  setInputValue((prev: number) => (!prev ? 1 : prev + 1));
                  triggers?.onChange && debouncedOnChange(value);
                }}
              >
                +
              </ActionIcon>
            </Group>
          </>
        ) : type === "number" ? (
          <MantineNumberInput
            ref={ref}
            autoComplete="off"
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            styles={merge(
              {},
              {
                root: { display: "block !important" },
                input: { ...customStyle },
              },
            )}
            {...props}
            {...componentProps}
            min={0}
            value={props.value || value || undefined}
            onChange={triggers?.onChange ? debouncedOnChange : undefined}
            label={undefined}
          />
        ) : (
          <MantineInput
            ref={ref}
            id={component.id}
            icon={iconName ? <Icon name={iconName} /> : null}
            styles={{
              root: {
                display: "block !important",
                width: "-webkit-fill-available",
                height: "-webkit-fill-available",
              },
              wrapper: {
                width: "-webkit-fill-available",
                height: "-webkit-fill-available",
              },
              input: {
                minHeight: "auto",
                ...customStyle,
                width: "-webkit-fill-available",
              },
            }}
            {...props}
            {...componentProps}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              triggers?.onChange ? debouncedOnChange(e) : undefined;
            }}
            rightSection={loading ? <Loader size="xs" /> : null}
            label={undefined}
          />
        )}
      </>
    );
  },
);
InputComponent.displayName = "Input";

export const Input = memo(withComponentWrapper<Props>(InputComponent), isSame);
