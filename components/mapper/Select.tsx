import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import debounce from "lodash.debounce";
import get from "lodash.get";
import merge from "lodash.merge";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
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
      triggers,
      loading,
      customText,
      customLinkText,
      customLinkUrl,
      ...componentProps
    } = component.props as any;
    const {
      endpointId,
      dataLabelKey,
      dataValueKey,
      resultsKey,
      binds,
      staleTime,
    } = component.onLoad ?? {};

    const customStyle = merge({}, props.style);
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setInputValue = useInputsStore((state) => state.setInputValue);
    const isDynamic =
      endpointId &&
      dataLabelKey &&
      dataValueKey &&
      resultsKey &&
      binds &&
      staleTime;
    const dataType = isDynamic ? "dynamic" : "static";
    const [data, setData] = useState(
      dataType === "static" ? component.props?.data : [],
    );

    const { data: response } = useEndpoint({
      endpointId,
      requestSettings: { binds, dataType, staleTime },
    });

    useEffect(() => {
      if (dataType === "dynamic") {
        if (!response || !dataLabelKey || !dataValueKey) {
          setData([]);
        } else {
          const result = get(response, resultsKey, response);
          if (Array.isArray(result)) {
            setData(
              (result ?? []).reduce((acc, item: any) => {
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
                label: result[dataLabelKey],
                value: result[dataValueKey],
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
      setInputValue(component.id!, value);
      debouncedOnChange(value);
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
        data={data}
        dropdownComponent={(props: any) => (
          <CustomDropdown
            {...props}
            components={{ customText, customLinkText, customLinkUrl }}
          />
        )}
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
