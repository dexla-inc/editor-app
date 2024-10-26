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
    {
      component,
      shareableContent,
      renderTree,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
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

    console.log("======>", component.children);

    return (
      <Box unstyled style={props.style as any} {...props} {...triggers}>
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
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : String()}
        <ChildrenWrapper />
      </Box>
    );
  },
);
SwitchComponent.displayName = "Switch";

export const Switch = memo(withComponentWrapper(SwitchComponent));
