import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { CSSObject, Title as MantineTitle, TitleProps } from "@mantine/core";
import get from "lodash.get";
import { forwardRef, memo, useImperativeHandle, useRef, useState } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  style: CSSObject;
} & TitleProps;

const TitleComponent = forwardRef(
  ({ renderTree, component, ...props }: Props, ref: any) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [isEditable, setIsEditable] = useState(false);
    const isPreviewMode = useEditorStore((state) => state.isPreviewMode);
    const updateTreeComponent = useEditorStore(
      (state) => state.updateTreeComponent,
    );
    const {
      children,
      data,
      triggers,
      repeatedIndex,
      dataPath,
      ...componentProps
    } = component.props as any;

    const handleDoubleClick = (e: any) => {
      e.preventDefault();
      if (!isPreviewMode) {
        setIsEditable(true);
      }
    };

    useImperativeHandle(ref, () => ({
      innerText: innerRef?.current?.innerText,
    }));

    const handleBlur = (e: any) => {
      e.preventDefault();
      if (!isPreviewMode) {
        setIsEditable(false);
        updateTreeComponent({
          componentId: component.id!,
          props: {
            children: innerRef?.current?.innerText,
          },
        });
      }
    };

    let value = isPreviewMode ? data?.value ?? children : children;

    if (isPreviewMode && typeof repeatedIndex !== "undefined" && dataPath) {
      const path = dataPath.replaceAll("[0]", `[${repeatedIndex}]`);
      value = get(data?.base ?? {}, path) ?? children;
    }

    return (
      <MantineTitle
        ref={innerRef}
        contentEditable={!isPreviewMode && isEditable}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        {...props}
        {...componentProps}
        {...triggers}
        suppressContentEditableWarning
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
