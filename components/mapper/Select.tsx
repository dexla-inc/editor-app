import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import cloneDeep from "lodash.clonedeep";
import debounce from "lodash.debounce";
import get from "lodash.get";
import merge from "lodash.merge";
import { forwardRef, memo, useCallback, useState } from "react";
import { InputLoader } from "../InputLoader";

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
    const customStyle = merge({}, props.style);
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setInputValue = useInputsStore((state) => state.setInputValue);
    const [localInputValue, setLocalInputValue] = useState(inputValue ?? "");

    // update values in store
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnChange = useCallback(
      debounce((value) => {
        setInputValue(component.id!, value);
      }, 400),
      [component.id],
    );

    // handle changes to input field
    const handleInputChange = (value: any) => {
      setLocalInputValue(value);
      debouncedOnChange(value);
      triggers?.onChange && triggers?.onChange(value);
    };

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
        dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData ?? [],
      );
    }

    const keys = Object.keys(get(data, "[0]", {}));

    return (
      <MantineSelect
        ref={ref}
        {...props}
        {...componentProps}
        {...triggers}
        style={{}}
        styles={{
          root: {
            position: "relative",
            width: customStyle.width,
            height: customStyle.height,
            minHeight: customStyle.minHeight,
            minWidth: customStyle.minWidth,
          },
          input: {
            ...customStyle,
            width: "-webkit-fill-available",
            height: "-webkit-fill-available",
            minHeight: "-webkit-fill-available",
            minWidth: "-webkit-fill-available",
          },
        }}
        withinPortal={false}
        maxDropdownHeight={150}
        data={
          data?.map((d: any) => {
            return {
              label: d.label ?? d[keys[1]],
              value: d.value ?? d[keys[0]],
            };
          }) ?? []
        }
        dropdownComponent={(props: any) => (
          <CustomDropdown
            {...props}
            components={{ customText, customLinkText, customLinkUrl }}
          />
        )}
        rightSection={loading ? <InputLoader /> : null}
        label={undefined}
        value={localInputValue}
        onChange={handleInputChange}
      />
    );
  },
);
SelectComponent.displayName = "Select";

export const Select = memo(
  withComponentWrapper<Props>(SelectComponent),
  isSame,
);
