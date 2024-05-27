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
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { children, triggers, ...componentProps } = component.props as any;
    const { optionValue } = component?.onLoad ?? {};

    return (
      <MantineCheckbox
        key={props.id}
        {...props}
        {...componentProps}
        styles={{
          label: { width: "100%" },
          root: { gap: "10px", alignItems: "flex-start" },
        }}
        label={null}
        value={optionValue}
        ref={ref}
      />
    );
  },
);

CheckboxItemComponent.displayName = "CheckboxItem";

export const CheckboxItem = memo(
  withComponentWrapper<Props>(CheckboxItemComponent),
);
