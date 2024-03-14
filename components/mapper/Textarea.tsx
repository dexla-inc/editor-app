import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useInputsStore } from "@/stores/inputs";
import { useThemeStore } from "@/stores/theme";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Loader,
  Textarea as MantineTextarea,
  TextareaProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { ChangeEvent, forwardRef, memo, useCallback, useState } from "react";
type Props = EditableComponentMapper & TextareaProps;

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
    const { borderStyle, fontSizeStyle } = useBrandingStyles();
    const [localInputValue, setLocalInputValue] = useState(inputValue ?? "");

    const customStyle = merge({}, borderStyle, fontSizeStyle, props.style, {
      backgroundColor,
      color,
    });

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

    return (
      <MantineTextarea
        ref={ref}
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
          : children?.toString()}
      </MantineTextarea>
    );
  },
);
TextareaComponent.displayName = "Textarea";

export const Textarea = memo(
  withComponentWrapper<Props>(TextareaComponent),
  isSame,
);
