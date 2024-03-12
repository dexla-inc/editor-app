import { useEndpoint } from "@/hooks/useEndpoint";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { memo } from "react";
import { isSame } from "@/utils/componentComparison";
import { useEditorTreeStore } from "@/stores/editorTree";

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

  const { endpointId } = component.onLoad ?? {};

  const { data } = useEndpoint({
    component,
    forceEnabled: !!endpointId,
    includeExampleResponse: !isPreviewMode,
  });

  console.log("data", data);
  console.log("props.shareableContent", props.shareableContent);
  console.log("component", component);
  console.log("children", children);

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
        : children}
    </MantineFlex>
  );
};

export const CardAndContainerWrapper = memo(
  CardAndContainerWrapperInner,
  isSame,
);
