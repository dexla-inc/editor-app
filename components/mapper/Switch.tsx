import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { ChangeEvent, forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & SwitchProps;

const SwitchComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
    const { label, triggers, ...componentProps } = component.props as any;
    const { optionValue } = component?.onLoad ?? {};

    const [value, setValue] = useInputValue(
      {
        value: component?.onLoad?.value ?? false,
      },
      props.id!,
    );

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (!isPreviewMode) {
        e.preventDefault(); // Prevent the checkbox state from changing
        return;
      }

      const newValue = e.currentTarget.checked;
      setValue(newValue);
      triggers?.onChange?.(e);
    };

    return (
      <MantineSwitch
        ref={ref}
        {...props}
        {...componentProps}
        wrapperProps={{ "data-id": component.id }}
        label={undefined}
        onChange={handleInputChange}
        checked={Boolean(value)}
        value={optionValue}
      />
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent));
