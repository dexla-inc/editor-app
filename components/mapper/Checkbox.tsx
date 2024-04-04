import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { EditableComponentMapper } from "@/utils/editor";
import { CheckboxProps, Checkbox as MantineCheckbox } from "@mantine/core";
import merge from "lodash.merge";
import { ChangeEvent, memo } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = EditableComponentMapper & CheckboxProps;

const CheckboxComponent = ({
  component,
  isPreviewMode,
  children,
  shareableContent,
  ...props
}: Props) => {
  const { label, triggers, bg, textColor, ...componentProps } =
    component.props as any;
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const { color, backgroundColor } = useChangeState({ bg, textColor });

  const { borderStyle } = useBrandingStyles();

  const customStyle = merge({}, borderStyle, props.style, {
    backgroundColor,
    color,
  });

  const inputValue = useComputeValue({
    componentId: component.id!,
    field: "value",
    shareableContent,
  });

  // handle changes to input field
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    updateTreeComponentAttrs({
      componentIds: [component.id!],
      attrs: { onLoad: { value: { static: newValue, dataType: "static" } } },
      save: false,
    });
    triggers?.onChange?.(e);
  };

  return (
    <MantineCheckbox
      {...props}
      {...componentProps}
      style={{}}
      styles={{
        root: {
          position: "relative",
          width: customStyle.width,
          height: customStyle.height,
          minHeight: customStyle.minHeight,
          minWidth: customStyle.minWidth,
        },
        input: {
          ...customStyle,
          width: "-webkit-fill-available",
          height: "-webkit-fill-available",
          minHeight: "-webkit-fill-available",
          minWidth: "-webkit-fill-available",
        },
      }}
      label={label}
      checked={Boolean(inputValue)}
      {...triggers}
      onChange={handleInputChange}
      wrapperProps={{ "data-id": component.id }}
    />
  );
};

export const Checkbox = memo(CheckboxComponent);
