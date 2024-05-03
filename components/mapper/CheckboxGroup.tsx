import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Checkbox as MantineCheckbox, CheckboxGroupProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { gapSizes } from "@/utils/defaultSizes";
import { useRenderData } from "@/hooks/components/useRenderData";
import { pick } from "next/dist/lib/pick";
import { omit } from "next/dist/shared/lib/router/utils/omit";

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

    const [value, setValue] = useInputValue<string[]>(
      {
        value: component?.onLoad?.value ?? [],
      },
      props.id!,
    );

    const { onChange, ...otherTriggers } = triggers || {};

    const defaultTriggers = isPreviewMode
      ? {
          onChange: (val: string[]) => {
            setValue(val);
            onChange && onChange({ target: { value: val } });
          },
        }
      : {};
    const customStyle = merge({}, defaultStyle, props.style);

    const rootStyleProps = ["flexWrap", "flexDirection"];

    const { renderData } = useRenderData({ component });

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
          ...pick(customStyle, rootStyleProps),
        }}
        styles={{
          label: { width: "100%" },
          //input: { ...omit(customStyle, wrapperStyleProps), minHeight: "auto" },
        }}
        // styles={merge(
        //   {
        //     label: { width: "100%" },
        //     root: { flexDirection: "column" }
        //   },
        //   styles,
        // )}
      >
        {renderData({ renderTree, shareableContent })}
      </MantineCheckbox.Group>
    );
  },
);

CheckboxGroupComponent.displayName = "CheckboxGroup";

export const CheckboxGroup = memo(
  withComponentWrapper<Props>(CheckboxGroupComponent),
);
