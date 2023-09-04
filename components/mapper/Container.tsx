import { useEditorStore } from "@/stores/editor";
import { Component } from "@/utils/editor";
import { Flex as MantineFlex, FlexProps, LoadingOverlay } from "@mantine/core";
import isEmpty from "lodash.isempty";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FlexProps;

export const Container = ({ renderTree, component, ...props }: Props) => {
  const isPreviewMode = useEditorStore((state) => state.isPreviewMode);

  const {
    children,
    style,
    bg,
    triggers,
    data: dataProp,
    exampleData = {},
    dataPath,
    loading,
    ...componentProps
  } = component.props as any;

  /* const data = !isPreviewMode
    ? isEmpty(exampleData?.value ?? exampleData)
      ? dataProp
      : exampleData?.value ?? exampleData
    : dataProp?.value ?? dataProp; */

  const data = !isPreviewMode ? undefined : dataProp?.value ?? dataProp;

  return (
    <MantineFlex
      {...props}
      {...componentProps}
      {...triggers}
      style={{ width: "100%", ...style }}
      bg={bg}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      {data &&
        !isEmpty(data) &&
        data.length > 0 &&
        data.map((_: any, repeatedIndex: number) => {
          return component.children && component.children.length > 0
            ? component.children?.map((child) =>
                renderTree({
                  ...child,
                  props: {
                    ...child.props,
                    ...componentProps,
                    repeatedIndex,
                  },
                })
              )
            : children;
        })}
      {(!data || isEmpty(data) || data.length === 0) &&
      component.children &&
      component.children.length > 0
        ? component.children?.map((child) =>
            renderTree({
              ...child,
              props: { ...child.props, ...componentProps },
            })
          )
        : children}
    </MantineFlex>
  );
};
