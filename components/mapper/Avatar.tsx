import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { AvatarProps, Avatar as MantineAvatar } from "@mantine/core";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";

type Props = EditableComponentMapper & AvatarProps;

const AvatarComponent = forwardRef(
  ({ renderTree, component, shareableContent, ...props }: Props, ref) => {
    const { triggers, data, size, ...componentProps } = component.props as any;

    const { computeValue } = useDataContext()!;
    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
    );
    const srcValue =
      computeValue({
        value: onLoad?.src,
        shareableContent,
      }) ?? component.props?.src;
    const childrenValue =
      computeValue({
        value: onLoad?.children,
        shareableContent,
      }) ?? component.props?.children;

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
          : childrenValue}
      </MantineAvatar>
    );
  },
);
AvatarComponent.displayName = "Avatar";

export const Avatar = memo(
  withComponentWrapper<Props>(AvatarComponent),
  isSame,
);
