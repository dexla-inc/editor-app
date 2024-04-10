import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Group, Radio as MantineRadio, RadioGroupProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";
import { useInputValue } from "@/hooks/useInputValue";

type Props = EditableComponentMapper & RadioGroupProps;

const RadioComponent = forwardRef(
  (
    { renderTree, component, isPreviewMode, shareableContent, ...props }: Props,
    ref,
  ) => {
    const { children, triggers, styles, ...componentProps } =
      component.props as any;

    const defaultStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };

    const onLoad = useEditorTreeStore(
      memoize(
        (state) => state.componentMutableAttrs[component?.id!]?.onLoad ?? {},
      ),
    );

    const [value, setValue] = useInputValue(
      {
        value: onLoad?.value ?? "",
      },
      component.id!,
    );

    const { onChange, ...otherTriggers } = triggers || {};

    const defaultTriggers = isPreviewMode
      ? {
          onChange: (val: string) => {
            setValue(val);
            onChange && onChange(val);
          },
        }
      : {
          onChange: () => {
            setValue(undefined);
          },
        };

    return (
      <MantineRadio.Group
        ref={ref}
        styles={merge({ label: { width: "100%" } }, styles)}
        {...props}
        wrapperProps={{ "data-id": component.id }}
        style={{
          ...(props.style ?? {}),
          ...defaultStyle,
        }}
        {...defaultTriggers}
        {...componentProps}
        {...otherTriggers}
        value={value}
        label={undefined}
      >
        <Group>
          {component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree(child, {
                  isInsideGroup: isPreviewMode,
                  value,
                }),
              )
            : children}
        </Group>
      </MantineRadio.Group>
    );
  },
);
RadioComponent.displayName = "Radio";

export const Radio = memo(withComponentWrapper<Props>(RadioComponent), isSame);
