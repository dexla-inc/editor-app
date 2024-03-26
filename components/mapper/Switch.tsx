import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & SwitchProps;

const SwitchComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { label, ...componentProps } = component.props as any;
    const setInputValue = useInputsStore((state) => state.setInputValue);

    return (
      <MantineSwitch
        ref={ref}
        {...props}
        {...componentProps}
        label={undefined}
        onChange={(e) => {
          componentProps.onChange?.(e);
          componentProps.triggers?.onChange?.(e);
          setInputValue(component.id!, e.target.checked);
        }}
      />
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent), isSame);
