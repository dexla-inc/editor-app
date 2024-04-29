import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useContentEditable } from "@/hooks/components/useContentEditable";
import { EditableComponentMapper } from "@/utils/editor";
import { AnchorProps, Anchor as MantineAnchor } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AnchorProps;

const LinkComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const {
      triggers,
      variable,
      children: defaultValue,
      ...componentProps
    } = component.props as any;
    const { style, ...restProps } = props;
    const { children: childrenValue = defaultValue } = component.onLoad;

    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

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

export const Link = memo(withComponentWrapper<Props>(LinkComponent));
