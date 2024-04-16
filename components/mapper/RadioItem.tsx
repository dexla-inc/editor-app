import { EditableComponentMapper } from "@/utils/editor";
import {
  Radio as MantineRadio,
  RadioProps as MantineRadioProps,
} from "@mantine/core";
import { forwardRef, memo, useState, ForwardedRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

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
      ...componentProps
    } = component.props as any;

    const { value = defaultValue } = component.onLoad ?? {};
    const { value: parentValue, isInsideGroup = false } = shareableContent;
    const checked = parentValue === String(value);

    const [_checked, setChecked] = useState<boolean>(checked);

    const defaultTriggers = isPreviewMode
      ? isInsideGroup
        ? {}
        : {
            onChange: (e: any) => {
              setChecked(e.currentTarget.checked);
            },
          }
      : {
          onChange: (e: any) => {
            e?.preventDefault();
            e?.stopPropagation();
            setChecked(false);
          },
        };

    return (
      <MantineRadio
        ref={ref}
        {...props}
        {...componentProps}
        {...defaultTriggers}
        wrapperProps={{ "data-id": component.id }}
        label={
          component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree(child, {
                  ...(checked && {
                    parentState: "checked",
                  }),
                }),
              )
            : children
        }
        value={value}
        checked={_checked}
        styles={{
          inner: { display: "none" },
          label: {
            padding: 0,
          },
        }}
      />
    );
  },
);

RadioItemComponent.displayName = "RadioItem";

export const RadioItem = memo(withComponentWrapper<Props>(RadioItemComponent));
