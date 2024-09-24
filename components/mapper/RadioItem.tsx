import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Radio as MantineRadio,
  RadioProps as MantineRadioProps,
} from "@mantine/core";
import { ForwardedRef, forwardRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";

// This is needed as RadioProps omits the ref prop
interface RadioProps extends MantineRadioProps {
  ref?: ForwardedRef<HTMLInputElement>;
}

type Props = EditableComponentMapper & RadioProps;

const RadioItemComponent = forwardRef<HTMLInputElement, Props>(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const {
      value: defaultValue,
      children,
      triggers,
      ...componentProps
    } = component.props as any;

    const { value = defaultValue } = component.onLoad ?? {};
    const { value: parentValue } = shareableContent;
    const checked = parentValue === String(value);

    return (
      <MantineRadio
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        {...(!isPreviewMode && { wrapperProps: { "data-id": component.id } })}
        label={
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
        }
        value={value}
        styles={{
          inner: { display: "none" },
          label: {
            padding: 0,
          },
          labelWrapper: { width: "100%" },
        }}
      />
    );
  },
);

RadioItemComponent.displayName = "RadioItem";

export const RadioItem = memo(withComponentWrapper<Props>(RadioItemComponent));
