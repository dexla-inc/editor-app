import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { CheckboxProps, Checkbox as MantineCheckbox } from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { ChangeEvent, memo, useCallback, useState } from "react";

type Props = EditableComponentMapper & CheckboxProps;

const CheckboxComponent = ({ component, isPreviewMode, ...props }: Props) => {
  const { label, value, triggers, bg, textColor, ...componentProps } =
    component.props as any;
  const { children, ...rest } = props;
  const inputValue = useInputsStore((state) => state.getValue(component.id!));
  const setStoreInputValue = useInputsStore((state) => state.setInputValue);
  const [checked, setChecked] = useState(inputValue ?? false);
  const { color, backgroundColor } = useChangeState({ bg, textColor });

  const { borderStyle } = useBrandingStyles();

  const customStyle = merge({}, borderStyle, props.style, {
    backgroundColor,
    color,
  });

  // update values in store
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = useCallback(
    debounce((value) => {
      setStoreInputValue(component.id!, value);
    }, 400),
    [component.id],
  );

  // handle changes to input field
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    debouncedOnChange(newValue);
    triggers?.onChange && triggers?.onChange(e);
  };

  return (
    <MantineCheckbox
      {...rest}
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
      value={value}
      checked={checked}
      {...triggers}
      onChange={handleInputChange}
    />
  );
};

export const Checkbox = memo(CheckboxComponent, isSame);
