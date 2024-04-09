import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { ChangeEvent, forwardRef, memo } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";
import { useInputValue } from "@/hooks/useInputValue";

type Props = EditableComponentMapper & SwitchProps;

const SwitchComponent = forwardRef(
  ({ component, shareableContent, isPreviewMode, ...props }: Props, ref) => {
    const { label, triggers, ...componentProps } = component.props as any;

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
      />
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent));
