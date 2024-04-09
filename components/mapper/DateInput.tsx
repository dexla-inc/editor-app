import { Icon } from "@/components/Icon";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import {
  DatePickerInputProps,
  DatePickerInput as MantineDatePickerInput,
} from "@mantine/dates";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { memo } from "react";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useChangeState } from "@/hooks/useChangeState";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";
import { useInputValue } from "@/hooks/useInputValue";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & DatePickerInputProps;

const DateInputComponent = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const {
    children,
    icon: iconName,
    iconPosition,
    triggers,
    styles,
    bg,
    textColor,
    ...componentProps
  } = component.props as any;
  const { borderStyle, inputStyle } = useBrandingStyles();
  const { color, backgroundColor } = useChangeState({ bg, textColor });

  const customStyle = merge({}, borderStyle, inputStyle, props.style);
  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");
  const { type: typeValue, valueFormat: valueFormatValue } = component?.onLoad;

  const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

  const typeValue = useComputeValue({
    componentId: component.id!,
    field: "type",
    shareableContent,
    staticFallback: component.props?.type,
  });
  const valueFormatValue = useComputeValue({
    componentId: component.id!,
    field: "valueFormat",
    shareableContent,
    staticFallback: component.props?.valueFormat,
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
  const { onChange, ...restTriggers } = triggers || {};

  const handleChange = (value: Date | null) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <>
      <MantineDatePickerInput
        {...(iconName && isPositionLeft && { icon: <Icon name={iconName} /> })}
        {...(iconName &&
          !isPositionLeft && { rightSection: <Icon name={iconName} /> })}
        {...props}
        {...componentProps}
        {...restTriggers}
        type={typeValue}
        valueFormat={valueFormatValue}
        value={value}
        onChange={handleChange}
        style={{}}
        styles={{
          root: {
            position: "relative",
            ...pick(customStyle, rootStyleProps),
            height: "fit-content",
          },
          input: {
            ...omit(customStyle, rootStyleProps),
            color,
            backgroundColor,
          },
          icon: {
            color,
          },
        }}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : children?.toString()}
      </MantineDatePickerInput>
    </>
  );
};

export const DateInput = memo(withComponentWrapper<Props>(DateInputComponent));
