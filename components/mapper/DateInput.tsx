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
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = EditableComponentMapper & DatePickerInputProps;

const DateInputComponent = ({
  renderTree,
  component,
  isPreviewMode,
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
  console.log({ component });
  const customStyle = merge({}, borderStyle, inputStyle, props.style);
  const isPositionLeft =
    !iconPosition || (iconPosition && iconPosition === "left");
  const { type: typeValue, valueFormat: valueFormatValue } = component?.onLoad;

  const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

  return (
    <>
      <MantineDatePickerInput
        {...(iconName && isPositionLeft && { icon: <Icon name={iconName} /> })}
        {...(iconName &&
          !isPositionLeft && { rightSection: <Icon name={iconName} /> })}
        {...props}
        {...componentProps}
        {...triggers}
        type={typeValue}
        valueFormat={valueFormatValue}
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
