import { useDataContext } from "@/contexts/DataProvider";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import { Title as MantineTitle, TitleProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";

type Props = EditableComponentMapper & TitleProps;

const TitleComponent = forwardRef(
  (
    { component, isPreviewMode, shareableContent, ...props }: Props,
    ref: any,
  ) => {
    const contentEditableProps = useContentEditable(
      component.id as string,
      ref,
    );

    const { triggers, variable, ...componentProps } = component.props as any;
    const { style, ...restProps } = props as any;

    const { computeValue } = useDataContext()!;
    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!].onLoad),
    );
    const childrenValue =
      computeValue({
        value: onLoad?.children,
        shareableContent,
      }) ?? component.props?.children;

    return (
      <MantineTitle
        {...contentEditableProps}
        {...restProps}
        {...componentProps}
        {...triggers}
        ref={ref}
        key={`${component.id}`}
        style={{
          ...style,
          ...(style?.fontSize ? { fontSize: style.fontSize + "px" } : {}),
        }}
      >
        {childrenValue}
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

export const Title = memo(withComponentWrapper<Props>(TitleComponent), isSame);
