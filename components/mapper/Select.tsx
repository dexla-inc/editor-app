import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Loader, Select as MantineSelect, SelectProps } from "@mantine/core";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & SelectProps;

const SelectComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const {
    children,
    data: dataProp,
    exampleData = {},
    dataPath,
    triggers,
    loading,
    ...componentProps
  } = component.props as any;

  let data = isEmpty(exampleData?.value ?? exampleData)
    ? dataProp?.value ?? dataProp
    : exampleData?.value ?? exampleData;

  if (isPreviewMode) {
    if (dataPath) {
      const path = dataPath.replaceAll("[0]", "");
      data = get(dataProp?.base ?? {}, path) ?? dataProp?.value ?? dataProp;
    } else {
      data = dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData;
    }
  } else if (dataPath) {
    const path = dataPath.replaceAll("[0]", "");
    data = get(data ?? {}, path) ?? data;
  }

  const keys = Object.keys(data?.[0]);

  return (
    <MantineSelect
      {...props}
      {...componentProps}
      {...triggers}
      withinPortal={false}
      maxDropdownHeight={120}
      data={data.map((d: any) => {
        return {
          label: d.label ?? d[keys[1]],
          value: d.value ?? d[keys[0]],
        };
      })}
      rightSection={loading ? <Loader size="xs" /> : null}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineSelect>
  );
};

export const Select = memo(SelectComponent, isSame);
