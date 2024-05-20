import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Group, Radio as MantineRadio, RadioGroupProps } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & RadioGroupProps;

const RadioComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const { children, triggers, styles, ...componentProps } =
      component.props as any;

    const defaultStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };

    const [value, setValue] = useInputValue<string>(
      {
        value: component?.onLoad?.value ?? "",
      },
      props.id!,
    );

    const { onChange, ...otherTriggers } = triggers || {};

    const defaultTriggers = isPreviewMode
      ? {
          onChange: (val: string) => {
            setValue(val);
            onChange && onChange({ target: { value: val } });
          },
        }
      : {};

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
        <Group grow w="100%">
          {component?.children?.map((child) =>
            renderTree(child, {
              ...shareableContent,
              isInsideGroup: isPreviewMode,
              value,
            }),
          )}
        </Group>
      </MantineRadio.Group>
    );
  },
);
RadioComponent.displayName = "Radio";

export const Radio = memo(withComponentWrapper<Props>(RadioComponent));
