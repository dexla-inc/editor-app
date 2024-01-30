import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/useChangeState";
import { useDefaultBorderStyle } from "@/hooks/useDefaultBorderStyle";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo, useEffect, useState } from "react";
import { InputLoader } from "../InputLoader";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & SelectProps;

const SelectComponent = forwardRef(
  ({ renderTree, component, children: child, ...props }: Props, ref) => {
    const {
      children,
      triggers,
      loading,
      dataType,
      bg,
      textColor,
      ...componentProps
    } = component.props as any;
    const { dataLabelKey, dataValueKey, resultsKey } = component.onLoad ?? {};
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle } = useDefaultBorderStyle();
    const customStyle = merge({}, borderStyle, props.style, {
      backgroundColor,
      color,
    });
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setInputValue = useInputsStore((state) => state.setInputValue);

    const [data, setData] = useState(
      dataType === "static" ? component.props?.data : [],
    );

    const { data: response } = useEndpoint({
      component,
    });

    useEffect(() => {
      if (dataType === "dynamic") {
        if (!response || !dataLabelKey || !dataValueKey) {
          setData([]);
        } else {
          if (Array.isArray(response)) {
            setData(
              response.reduce((acc, item: any) => {
                acc.push({
                  label: item[dataLabelKey],
                  value: item[dataValueKey],
                });

                return acc;
              }, []),
            );
          } else {
            setData([
              {
                label: response[dataLabelKey],
                value: response[dataValueKey],
              },
            ]);
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultsKey, dataLabelKey, dataValueKey, dataType, response]);

    useEffect(() => {
      if (dataType === "static") {
        setData(component.props?.data ?? []);
      }
    }, [component.props?.data, dataType]);

    const handleInputChange = (value: any) => {
      setInputValue(component.id!, value);
      triggers?.onChange && triggers?.onChange(value);
    };

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
            ...pick(customStyle, [
              "display",
              "width",
              "height",
              "minHeight",
              "minWidth",
            ]),
          },
          input: customStyle,
        }}
        withinPortal={false}
        maxDropdownHeight={150}
        data={data}
        dropdownComponent={CustomDropdown}
        rightSection={loading ? <InputLoader /> : null}
        label={undefined}
        value={inputValue}
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
