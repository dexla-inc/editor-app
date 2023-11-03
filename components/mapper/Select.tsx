import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Loader, Select as MantineSelect, SelectProps } from "@mantine/core";
import get from "lodash.get";
import { memo } from "react";
import cloneDeep from "lodash.clonedeep";

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

  let data = [];

  if (isPreviewMode) {
    data = cloneDeep(
      dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData,
    );
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
      label={undefined}
    />
  );
};

export const Select = memo(SelectComponent, isSame);
