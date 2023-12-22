import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Loader,
  Textarea as MantineTextarea,
  TextareaProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextareaProps;

const TextareaComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
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
        ref={ref}
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
  },
);
TextareaComponent.displayName = "Textarea";

export const Textarea = memo(
  withComponentWrapper<Props>(TextareaComponent),
  isSame,
);
