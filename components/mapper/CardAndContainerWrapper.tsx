import { useEndpoint } from "@/hooks/useEndpoint";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import { FlexProps, LoadingOverlay, Flex as MantineFlex } from "@mantine/core";
import { memo } from "react";
import { isSame } from "@/utils/componentComparison";

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

  const { endpointId } = component.onLoad ?? {};

  const { data } = useEndpoint({
    component,
    forceEnabled: !!endpointId,
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
      {endpointId &&
        Array.isArray(data) &&
        data.map((item: any, parentIndex: number) => {
          return component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree(child, {
                  ...props.shareableContent,
                  data: item,
                  parentIndex,
                }),
              )
            : children;
        })}
      {endpointId &&
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
