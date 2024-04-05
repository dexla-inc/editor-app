import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { ChangeEvent, forwardRef, memo } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = EditableComponentMapper & SwitchProps;

const SwitchComponent = forwardRef(
  ({ component, shareableContent, isPreviewMode, ...props }: Props, ref) => {
    const { label, triggers, ...componentProps } = component.props as any;
    const updateTreeComponentAttrs = useEditorTreeStore(
      (state) => state.updateTreeComponentAttrs,
    );
    const inputValue = useComputeValue({
      componentId: component.id!,
      field: "value",
      shareableContent,
    });

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.checked;
      await updateTreeComponentAttrs({
        componentIds: [component.id!],
        attrs: { onLoad: { value: { static: newValue, dataType: "static" } } },
        save: false,
      });
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
        checked={Boolean(inputValue)}
      />
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent));
