import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import { AvatarProps, Avatar as MantineAvatar } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AvatarProps;

const AvatarComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { triggers, data, size, ...componentProps } = component.props as any;
    const { children: childrenValue, src: srcValue } = component.onLoad;

    const { avatarStyle } = useBrandingStyles();

    const customStyle = merge({}, avatarStyle, props.style);

    return (
      <MantineAvatar
        ref={ref}
        {...props}
        {...componentProps}
        src={srcValue}
        styles={customStyle}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : String(childrenValue)}
      </MantineAvatar>
    );
  },
);
AvatarComponent.displayName = "Avatar";

export const Avatar = memo(withComponentWrapper<Props>(AvatarComponent));
