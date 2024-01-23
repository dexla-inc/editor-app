import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/useChangeState";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  Loader,
  Textarea as MantineTextarea,
  TextareaProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { ChangeEvent, forwardRef, memo, useCallback, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & TextareaProps;

const TextareaComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref) => {
    const {
      children,
      triggers,
      value,
      loading,
      bg,
      textColor,
      ...componentProps
    } = component.props as any;
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setStoreInputValue = useInputsStore((state) => state.setInputValue);
    const { color, backgroundColor } = useChangeState({ bg, textColor });

    const [localInputValue, setLocalInputValue] = useState(inputValue ?? "");

    // update values in store
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
      debounce((value) => {
        setStoreInputValue(component.id!, value);
      }, 400),
      [component.id],
    );

    // handle changes to input field
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalInputValue(newValue);
      debouncedOnChange(newValue);
      triggers?.onChange && triggers?.onChange(e);
    };

    const customStyle = merge({}, props.style, { backgroundColor, color });

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
            ...pick(customStyle, [
              "display",
              "width",
              "height",
              "minHeight",
              "minWidth",
            ]),
          },
          input: customStyle,
        }}
        value={localInputValue}
        onChange={handleInputChange}
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
