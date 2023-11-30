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
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { memo, useCallback, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NumberInputProps &
  TextInputProps;

const InputComponent = ({ renderTree, component, ...props }: Props) => {
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

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const type = (componentProps.type as string) || "text";

  const customStyle = merge({}, { borderColor }, props.style);
  return (
    <>
      {type === "number" ? (
        <MantineNumberInput
          autoComplete={false}
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
};

export const Input = memo(InputComponent, isSame);
