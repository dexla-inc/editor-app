import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { forwardRef, memo, useCallback, useEffect, useState } from "react";
import { InputLoader } from "../InputLoader";
import { useEndpoint } from "@/hooks/useEndpoint";

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
    const customStyle = merge({}, props.style);
    const inputValue = useInputsStore((state) => state.getValue(component.id!));
    const setInputValue = useInputsStore((state) => state.setInputValue);
    const [localInputValue, setLocalInputValue] = useState(inputValue ?? "");
    const { apiCall } = useEndpoint();
    const [data, setData] = useState(component.props?.data ?? []);

    useEffect(() => {
      if (component.props?.dataType === "dynamic") {
        apiCall(component.props?.endpointId).then((result = []) => {
          if (Array.isArray(result)) {
            setData(
              (result ?? []).map((item: any) => ({
                label: item[component.props?.dataLabelKey ?? ""],
                value: item[component.props?.dataValueKey ?? ""],
              })),
            );
          }
        });
      } else {
        setData(component.props?.data ?? []);
      }
    }, [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      component.props?.data,
      component.props?.endpointId,
      component.props?.dataType,
      component.props?.dataLabelKey,
      component.props?.dataValueKey,
    ]);

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
