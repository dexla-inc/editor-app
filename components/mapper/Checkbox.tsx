import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { EditableComponentMapper } from "@/utils/editor";
import {
  CheckboxProps as MantineCheckboxProps,
  Checkbox as MantineCheckbox,
} from "@mantine/core";
import merge from "lodash.merge";
import { ChangeEvent, forwardRef, memo, ForwardedRef } from "react";
import { useInputValue } from "@/hooks/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

// This is needed as CheckboxProps omits the ref prop
interface CheckboxProps extends MantineCheckboxProps {
  ref?: ForwardedRef<HTMLInputElement>;
}
type Props = EditableComponentMapper & CheckboxProps;

const CheckboxComponent = forwardRef<HTMLInputElement, Props>(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const { label, triggers, bg, textColor, ...componentProps } =
      component.props as any;
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle } = useBrandingStyles();
    const customStyle = merge({}, borderStyle, props.style, {
      backgroundColor,
      color,
    });
    const [value, setValue] = useInputValue(
      {
        value: component?.onLoad?.value ?? "",
      },
      component.id!,
    );
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isPreviewMode) {
        e.preventDefault();
        return;
      }
      const newValue = e.target.checked;
      setValue(newValue);
      triggers?.onChange?.(e);
    };
    return (
      <MantineCheckbox
        ref={ref}
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
        label={label}
        checked={Boolean(value)}
        {...triggers}
        onChange={handleInputChange}
        wrapperProps={{ "data-id": component.id }}
      />
    );
  },
);

CheckboxComponent.displayName = "Checkbox";

export const Checkbox = memo(withComponentWrapper<Props>(CheckboxComponent));
