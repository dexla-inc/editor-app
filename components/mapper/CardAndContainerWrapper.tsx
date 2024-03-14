import { useEndpoint } from "@/hooks/useEndpoint";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { memo } from "react";
import { isSame } from "@/utils/componentComparison";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";

type Props = EditableComponentMapper & FlexProps;

const CardAndContainerWrapperInner = ({
  renderTree,
  component,
  ref,
  ...props
}: Props) => {
  const { children, bg, triggers, loading, dataType, gap, ...componentProps } =
    component.props as any;
  const gapPx = convertSizeToPx(gap, "gap");
  const isPreviewMode = useEditorTreeStore((state) => state.isPreviewMode);

  const onLoad = useEditorTreeStore(
    memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
  );
  const { endpointId } = onLoad ?? {};

  const { data } = useEndpoint({
    component,
    forceEnabled: !!endpointId,
    includeExampleResponse: !isPreviewMode,
  });

  return (
    <MantineFlex
      ref={ref}
      {...props}
      {...componentProps}
      {...triggers}
      style={{ ...props.style, gap: gapPx }}
      bg={bg}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {endpointId && Array.isArray(data)
        ? data.map((item: any, parentIndex: number) => {
            return component.children && component.children.length > 0
              ? component.children?.map((child) =>
                  renderTree(child, {
                    ...props.shareableContent,
                    data: item,
                    parentIndex,
                  }),
                )
              : children;
            // TODO: I am unsure we need this object part
          })
        : endpointId &&
          typeof data === "object" &&
          component.children?.map((child) =>
            renderTree(
              {
                ...child,
              },
              {
                ...props.shareableContent,
                data,
              },
            ),
          )}
      {!endpointId && component.children && component.children.length > 0
        ? component.children?.map((child) =>
            renderTree(child, props.shareableContent),
          )
        : children?.toString()}
    </MantineFlex>
  );
};

export const CardAndContainerWrapper = memo(
  CardAndContainerWrapperInner,
  isSame,
);
