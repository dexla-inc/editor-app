import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Loader, Select as MantineSelect, SelectProps } from "@mantine/core";
import get from "lodash.get";
import merge from "lodash.merge";
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
    styles,
    ...componentProps
  } = component.props as any;

  let data = [];

  if (isPreviewMode) {
    data = dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData;
    if (dataPath) {
      const path = dataPath.replaceAll("[0]", "");
      data = get(dataProp, `base.${path}`, dataProp?.value ?? dataProp);
    }
  } else if (dataPath) {
    data = exampleData.value ?? exampleData ?? dataProp?.value ?? dataProp;
    const path = dataPath.replaceAll("[0]", "");
    data = get(data, path, data);
  }

  const keys = Object.keys(get(data, "[0]", {}));

  return (
    <MantineSelect
      styles={merge({ label: { width: "100%" } }, styles)}
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
    />
  );
};

export const Select = memo(SelectComponent, isSame);
