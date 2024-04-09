import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { EditableComponentMapper } from "@/utils/editor";
import { CheckboxProps, Checkbox as MantineCheckbox } from "@mantine/core";
import merge from "lodash.merge";
import { ChangeEvent, memo } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useInputValue } from "@/hooks/useInputValue";
import { memoize } from "proxy-memoize";

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

  const { color, backgroundColor } = useChangeState({ bg, textColor });

  const { borderStyle } = useBrandingStyles();

  const customStyle = merge({}, borderStyle, props.style, {
    backgroundColor,
    color,
  });

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

  // handle changes to input field
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isPreviewMode) {
      e.preventDefault(); // Prevent the checkbox state from changing
      return;
    }

    const newValue = e.target.checked;
    setValue(newValue);
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
      checked={Boolean(value)}
      {...triggers}
      onChange={handleInputChange}
      wrapperProps={{ "data-id": component.id }}
    />
  );
};

export const Checkbox = memo(CheckboxComponent);
