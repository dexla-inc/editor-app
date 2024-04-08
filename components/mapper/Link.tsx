import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

type Props = EditableComponentMapper & AnchorProps;

const LinkComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { triggers, variable, ...componentProps } = component.props as any;
    const { style, ...restProps } = props;

    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const childrenValue = useComputeValue({
      componentId: component.id!,
      field: "children",
      shareableContent,
      staticFallback: component.props?.children,
    });

    const { textStyle } = useBrandingStyles();

    const customStyle = merge({}, textStyle, style);

    return (
      <MantineAnchor
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref}
        style={customStyle}
      >
        {String(childrenValue)}
      </MantineAnchor>
    );
  },
);
LinkComponent.displayName = "Link";

export const Link = memo(withComponentWrapper<Props>(LinkComponent), isSame);
