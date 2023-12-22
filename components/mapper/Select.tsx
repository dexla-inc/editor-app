import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getColorFromTheme } from "@/utils/editor";
import { Loader, Select as MantineSelect, SelectProps } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import get from "lodash.get";
import merge from "lodash.merge";
import { forwardRef, memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode?: boolean;
} & SelectProps;

const SelectComponent = forwardRef(
  (
    { renderTree, component, isPreviewMode, children: child, ...props }: Props,
    ref,
  ) => {
    const {
      children,
      data: dataProp,
      exampleData = {},
      dataPath,
      triggers,
      loading,
      customText,
      customLinkText,
      customLinkUrl,
      ...componentProps
    } = component.props as any;
    const theme = useEditorStore((state) => state.theme);
    const borderColor = getColorFromTheme(theme, "Border.6");

    const { height, width, ...style } = props.style ?? {};
    const customStyle = merge({}, { borderColor }, style);

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
    } else {
      data = cloneDeep(
        dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData,
      );
    }

    const keys = Object.keys(get(data, "[0]", {}));

    return (
      <MantineSelect
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        styles={{
          input: { height, width: "100%", ...customStyle },
          root: { width },
        }}
        withinPortal={false}
        maxDropdownHeight={150}
        data={data.map((d: any) => {
          return {
            label: d.label ?? d[keys[1]],
            value: d.value ?? d[keys[0]],
          };
        })}
        dropdownComponent={(props: any) => (
          <CustomDropdown
            {...props}
            components={{ customText, customLinkText, customLinkUrl }}
          />
        )}
        rightSection={loading ? <Loader size="xs" /> : null}
        label={undefined}
      />
    );
  },
);
SelectComponent.displayName = "Select";

export const Select = memo(
  withComponentWrapper<Props>(SelectComponent),
  isSame,
);
