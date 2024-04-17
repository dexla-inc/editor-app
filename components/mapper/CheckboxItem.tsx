import { EditableComponentMapper } from "@/utils/editor";
import {
  Checkbox as MantineCheckbox,
  CheckboxProps as MantineCheckboxProps,
} from "@mantine/core";
import { forwardRef, memo, useState, ForwardedRef } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

// This is needed as CheckboxProps omits the ref prop
interface CheckboxProps extends MantineCheckboxProps {
  ref?: ForwardedRef<HTMLInputElement>;
}

type Props = EditableComponentMapper & CheckboxProps;

const CheckboxItemComponent = forwardRef<HTMLInputElement, Props>(
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
    const { value: parentValue } = shareableContent;

    return (
      // <MantineCheckbox value={value}
      // styles={{
      //   label: { width: "100%" },
      //   root: { gap: "10px", alignItems: "flex-start" } }}
      //   label={
      //       component.children && component.children.length > 0
      //         ? component.children?.map((child) =>
      //             renderTree(child, {
      //               ...(checked && {
      //                 parentState: "checked",
      //               }),
      //             }),
      //           )
      //         : children
      //     }
      //    />
      <MantineCheckbox
        {...props}
        {...componentProps}
        wrapperProps={{ "data-id": component.id }}
        label={
          component.children && component.children.length > 0
            ? component.children?.map((child) => renderTree(child))
            : children
        }
        value={value}
        style={{ gap: "10px" }}
        styles={{ root: { gap: "10px" } }}
      />
    );
  },
);

CheckboxItemComponent.displayName = "CheckboxItem";

export const CheckboxItem = memo(
  withComponentWrapper<Props>(CheckboxItemComponent),
);
