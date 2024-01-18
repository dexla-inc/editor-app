import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useContentEditable } from "@/hooks/useContentEditable";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { CSSObject, Title as MantineTitle, TitleProps } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  style: CSSObject;
  isPreviewMode: boolean;
} & TitleProps;

const TitleComponent = forwardRef(
  ({ renderTree, component, isPreviewMode, ...props }: Props, ref: any) => {
    const contentEditableProps = useContentEditable(component.id as string);

    const {
      children,
      data,
      triggers,
      repeatedIndex,
      dataPath,
      ...componentProps
    } = component.props as any;

    let value = isPreviewMode ? data?.value ?? children : children;

    if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
      const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
      value = get(data?.base ?? {}, path) ?? children;
    }

    return (
      <MantineTitle
        {...contentEditableProps}
        {...props}
        {...componentProps}
        {...triggers}
        key={`${component.id}-${repeatedIndex}`}
      >
        {component.children && component.children.length > 0
          ? component.children?.map((child) => renderTree(child))
          : value}
      </MantineTitle>
    );
  },
);

TitleComponent.displayName = "Title";

export const Title = memo(withComponentWrapper<Props>(TitleComponent), isSame);
