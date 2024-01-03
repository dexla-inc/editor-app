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
import merge from "lodash.merge";
import { useInputsStore } from "@/stores/inputs";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextareaProps;

const TextareaComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const { children, triggers, value, loading, ...componentProps } =
      component.props as any;
    const [inputValue, setInputValue] = useState(value);
    const setStoreInputValue = useInputsStore((state) => state.setInputValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
      debounce((e) => {
        triggers?.onChange(e);
        setStoreInputValue(component.id!, e.target.value);
      }, 400),
      [debounce, component.id],
    );

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const customStyle = merge({}, props.style);

    return (
      <MantineTextarea
        ref={ref}
        id={component.id}
        {...props}
        {...componentProps}
        style={{}}
        styles={{
          root: {
            position: "relative",
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
