import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Loader,
  Textarea as MantineTextarea,
  TextareaProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import { memo, useCallback, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextareaProps;

const TextareaComponent = ({ renderTree, component, ...props }: Props) => {
  const { children, triggers, value, loading, ...componentProps } =
    component.props as any;
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

  return (
    <MantineTextarea
      id={component.id}
      styles={{ root: { display: "block !important" } }}
      {...props}
      {...componentProps}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        triggers?.onChange ? debouncedOnChange(e) : undefined;
      }}
      rightSection={loading ? <Loader size="xs" /> : null}
      label={undefined}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineTextarea>
  );
};

export const Textarea = memo(TextareaComponent, isSame);
