import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Checkbox as MantineCheckbox,
  CheckboxGroupProps,
  Group,
} from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { gapSizes } from "@/utils/defaultSizes";
import { useRenderData } from "@/hooks/components/useRenderData";
import { pick } from "next/dist/lib/pick";

type Props = EditableComponentMapper & CheckboxGroupProps;

const defaultStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justify: "center",
};

const CheckboxGroupComponent = forwardRef(
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
    const {
      style,
      children,
      triggers,
      styles,
      gap,
      workLikeRadio,
      ...componentProps
    } = component.props as any;

    const gapSize = gapSizes[gap ?? "sm"];

    const [value, setInputStore] = useInputValue<string[]>(
      {
        value: component?.onLoad?.value ?? [],
      },
      props.id!,
    );

    const { onChange, ...otherTriggers } = triggers || {};

    const defaultTriggers = isPreviewMode
      ? {
          onChange: (val: string[]) => {
            if (workLikeRadio && val.length > 1) {
              val = [val[val.length - 1]];
            }
            setInputStore(val);
            onChange?.({ target: { value: val } });
          },
        }
      : {};
    const customStyle = merge({}, defaultStyle, props.style);
    const checkboxWrapperProps = workLikeRadio
      ? { grow: true }
      : { style: { justifyContent: "space-between" } };

    const rootStyleProps = ["flexWrap", "flexDirection"];

    const { renderData } = useRenderData({
      component,
      shareableContent: {
        ...shareableContent,
        value,
        isInsideGroup: true,
      },
    });

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
          //gap: gapSize,
          ...pick(customStyle, rootStyleProps),
          display: "grid",
        }}
        styles={{
          root: { width: customStyle?.width ?? "100%" },
        }}
      >
        {component?.children?.map((child) =>
          renderTree(child, {
            ...shareableContent,
            isInsideGroup: isPreviewMode,
            value,
          }),
        )}
        <ChildrenWrapper />
      </MantineCheckbox.Group>
    );
  },
);

CheckboxGroupComponent.displayName = "CheckboxGroup";

export const CheckboxGroup = memo(
  withComponentWrapper<Props>(CheckboxGroupComponent),
);
