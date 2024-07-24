import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { EditableComponentMapper } from "@/utils/editor";
import {
  CheckboxProps as MantineCheckboxProps,
  Checkbox as MantineCheckbox,
} from "@mantine/core";
import merge from "lodash.merge";
import { ChangeEvent, forwardRef, memo, ForwardedRef } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { safeJsonParse } from "@/utils/common";
import { isPreviewModeSelector } from "@/utils/componentSelectors";

// This is needed as CheckboxProps omits the ref prop
interface CheckboxProps extends MantineCheckboxProps {
  ref?: ForwardedRef<HTMLInputElement>;
}
type Props = EditableComponentMapper & CheckboxProps;

const CheckboxComponent = forwardRef<HTMLInputElement, Props>(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { triggers, bg, textColor, ...componentProps } =
      component.props as any;
    const { optionValue } = component?.onLoad ?? {};
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle } = useBrandingStyles();
    const customStyle = merge({}, borderStyle, props.style, {
      backgroundColor,
      color,
    });

    const [value, setValue] = useInputValue<boolean>(
      {
        value: safeJsonParse(component?.onLoad?.value) ?? false,
      },
      props.id!,
    );
    const checked = shareableContent?.value?.includes(optionValue);
    const isInsideGroup = shareableContent?.isInsideGroup;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const isPreviewMode = isPreviewModeSelector(
        useEditorTreeStore.getState(),
      );
      if (!isPreviewMode) return;
      const newValue = e.target.checked;
      setValue(newValue);
      triggers?.onChange?.(e);
    };

    const defaultTriggers = !isInsideGroup
      ? { onChange: handleInputChange }
      : {};

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
          ...(isInsideGroup && {
            inner: { display: "none" },
            label: {
              padding: 0,
            },
            labelWrapper: { width: "100%" },
          }),
        }}
        wrapperProps={{ "data-id": component.id }}
        label={
          isInsideGroup && (
            <div id={component.id} {...triggers}>
              {component.children?.map((child) =>
                renderTree(child, {
                  ...shareableContent,
                  ...(checked && {
                    parentState: "checked",
                  }),
                }),
              )}
            </div>
          )
        }
        {...(!isInsideGroup && { checked: value })}
        value={optionValue}
        {...triggers}
        {...defaultTriggers}
        onClick={(e) => {
          e.stopPropagation();
          props.onClick?.(e);
          triggers?.onClick?.(e);
        }}
      />
    );
  },
);

CheckboxComponent.displayName = "Checkbox";

export const Checkbox = memo(withComponentWrapper<Props>(CheckboxComponent));
