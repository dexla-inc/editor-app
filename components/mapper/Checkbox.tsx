import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { EditableComponentMapper } from "@/utils/editor";
import {
  CheckboxProps as MantineCheckboxProps,
  Checkbox as MantineCheckbox,
  Box,
} from "@mantine/core";
import merge from "lodash.merge";
import { ChangeEvent, forwardRef, memo, ForwardedRef } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { safeJsonParse } from "@/utils/common";

// This is needed as CheckboxProps omits the ref prop
interface CheckboxProps extends MantineCheckboxProps {
  ref?: ForwardedRef<HTMLInputElement>;
}
type Props = EditableComponentMapper & CheckboxProps;

const CheckboxComponent = forwardRef<HTMLInputElement, Props>(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
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
      if (!isPreviewMode) return;
      const newValue = e.target.checked;
      setValue(newValue);
      triggers?.onChange?.(e);
    };

    const defaultTriggers =
      isPreviewMode && !isInsideGroup ? { onChange: handleInputChange } : {};

    return (
      <Box
        unstyled
        style={props.style as any}
        {...props}
        {...triggers}
        id={component.id}
      >
        <MantineCheckbox
          ref={ref}
          {...componentProps}
          style={{}}
          styles={{
            root: {
              position: "relative",
              width: customStyle.width,
              height: customStyle.height,
              minHeight: customStyle.minHeight,
              minWidth: customStyle.minWidth,
              gridArea: "1/1/-1/-1",
            },
            input: {
              ...customStyle,
              width: "-webkit-fill-available",
              height: "-webkit-fill-available",
              minHeight: "-webkit-fill-available",
              minWidth: "-webkit-fill-available",
            },
            body: { width: "100%", height: "100%" },
            inner: { width: "100%", height: "100%" },
            ...(isInsideGroup && {
              inner: { display: "none", width: "100%", height: "100%" },
              label: {
                padding: 0,
              },
              labelWrapper: { width: "100%" },
            }),
          }}
          label={
            isInsideGroup && (
              <div {...(isPreviewMode && { id: component.id })} {...triggers}>
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
          {...defaultTriggers}
          onClick={(e) => {
            e.stopPropagation();
            props.onClick?.(e);
            triggers?.onClick?.(e);
          }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);

CheckboxComponent.displayName = "Checkbox";

export const Checkbox = memo(withComponentWrapper<Props>(CheckboxComponent));
