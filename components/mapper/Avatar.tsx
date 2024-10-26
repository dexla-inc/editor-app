import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { EditableComponentMapper } from "@/utils/editor";
import { AvatarProps, Avatar as MantineAvatar } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & AvatarProps;

const AvatarComponent = forwardRef(
  (
    {
      renderTree,
      component,
      shareableContent,
      grid: { ChildrenWrapper, isGridCss },
      ...props
    }: Props,
    ref,
  ) => {
    const { triggers, data, size, ...componentProps } = component.props as any;
    const { children: childrenValue, src: srcValue } = component.onLoad;

    const { avatarStyle } = useBrandingStyles();

    const customStyle = merge({}, avatarStyle, props.style);

    return (
      <MantineAvatar
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        src={srcValue}
        style={customStyle}
        styles={
          isGridCss
            ? { placeholder: { display: "grid", gridArea: "1/1/-1/-1" } }
            : undefined
        }
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, shareableContent),
            )
          : String(childrenValue)}
        <ChildrenWrapper />
      </MantineAvatar>
    );
  },
);
AvatarComponent.displayName = "Avatar";

export const Avatar = memo(withComponentWrapper<Props>(AvatarComponent));
