import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Checkbox as MantineCheckbox,
  CheckboxGroupProps,
  Group,
} from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useMemo } from "react";
import { useInputValue } from "@/hooks/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { gapSizes } from "@/utils/defaultSizes";

type Props = EditableComponentMapper & CheckboxGroupProps;

const defaultStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justify: "center",
};

const CheckboxGroupComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const { style, children, triggers, styles, gap, ...componentProps } =
      component.props as any;

    const gapSize = gapSizes[gap ?? "sm"];

    const [value, setValue] = useInputValue(
      {
        value: component?.onLoad?.value ?? "",
      },
      props.id!,
    );

    const { onChange, ...otherTriggers } = triggers || {};

    const defaultTriggers = isPreviewMode
      ? {
          onChange: (val: string[]) => {
            setValue(val);
            onChange && onChange(val);
          },
        }
      : {};

    return (
      <MantineCheckbox.Group
        ref={ref}
        {...props}
        wrapperProps={{ "data-id": component.id }}
        {...defaultTriggers}
        {...componentProps}
        {...otherTriggers}
        value={value}
        label={undefined}
        style={{
          ...(style ?? {}),
          ...defaultStyle,
          gap: gapSize,
        }}
        styles={merge(
          {
            label: { width: "100%" },
          },
          styles,
        )}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, {
                isInsideGroup: isPreviewMode,
                value,
              }),
            )
          : children}
      </MantineCheckbox.Group>
    );
  },
);

CheckboxGroupComponent.displayName = "CheckboxGroup";

export const CheckboxGroup = memo(
  withComponentWrapper<Props>(CheckboxGroupComponent),
);
