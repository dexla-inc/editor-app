import { Icon } from "@/components/Icon";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Loader,
  TextInput as MantineInput,
  NumberInput as MantineNumberInput,
  NumberInputProps,
  TextInputProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import { memo, useCallback, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & NumberInputProps &
  TextInputProps;

const InputComponent = ({ renderTree, component, ...props }: Props) => {
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
  return (
    <>
      {type === "number" ? (
        <MantineNumberInput
          id={component.id}
          icon={iconName ? <Icon name={iconName} /> : null}
          styles={{ root: { display: "block !important" } }}
          {...props}
          {...componentProps}
          min={0}
          value={props.value || value || undefined}
          onChange={triggers?.onChange ? debouncedOnChange : undefined}
        >
          {component.children && component.children.length > 0
            ? component.children?.map((child) => renderTree(child))
            : children}
        </MantineNumberInput>
      ) : (
        <MantineInput
          id={component.id}
          icon={iconName ? <Icon name={iconName} /> : null}
          styles={{ root: { display: "block !important" } }}
          {...props}
          {...componentProps}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            triggers?.onChange ? debouncedOnChange(e) : undefined;
          }}
          rightSection={loading ? <Loader size="xs" /> : null}
        >
          {component.children && component.children.length > 0
            ? component.children?.map((child) => renderTree(child))
            : children}
        </MantineInput>
      )}
    </>
  );
};

export const Input = memo(InputComponent, isSame);
