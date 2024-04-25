import { EditableComponentMapper } from "@/utils/editor";
import {
  Checkbox as MantineCheckbox,
  CheckboxProps as MantineCheckboxProps,
} from "@mantine/core";
import { forwardRef, memo, ForwardedRef } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

// This is needed as CheckboxProps omits the ref prop
interface CheckboxProps extends MantineCheckboxProps {
  ref?: ForwardedRef<HTMLInputElement>;
}

type Props = EditableComponentMapper & CheckboxProps;

const CheckboxItemComponent = forwardRef<HTMLInputElement, Props>(
  ({ renderTree, component, shareableContent = {}, ...props }: Props, ref) => {
    const { children, ...componentProps } = component.props as any;

    return (
      <MantineCheckbox
        {...props}
        {...componentProps}
        styles={{
          label: { width: "100%" },
          root: { gap: "10px", alignItems: "flex-start" },
        }}
        wrapperProps={{ "data-id": component.id }}
        label={component?.children?.map((child) =>
          renderTree(child, shareableContent),
        )}
      />
    );
  },
);

CheckboxItemComponent.displayName = "CheckboxItem";

export const CheckboxItem = memo(
  withComponentWrapper<Props>(CheckboxItemComponent),
);
