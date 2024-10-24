import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import { Box, Switch as MantineSwitch, SwitchProps } from "@mantine/core";
import { ChangeEvent, forwardRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & SwitchProps;

const SwitchComponent = forwardRef(
  (
    { component, shareableContent, grid: { ChildrenWrapper }, ...props }: Props,
    ref,
  ) => {
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
      <Box unstyled style={props.style as any} {...props} {...triggers}>
        <MantineSwitch
          ref={ref}
          {...componentProps}
          wrapperProps={{ "data-id": component.id }}
          label={undefined}
          onChange={handleInputChange}
          checked={Boolean(value)}
          value={optionValue}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent));
