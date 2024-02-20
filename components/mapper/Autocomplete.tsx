import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import {
  AutocompleteItem,
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo, useEffect, useState } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & AutocompleteProps;

const AutocompleteComponent = forwardRef(
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

    const componentId = component.id as string;
    const { dataLabelKey, dataValueKey, resultsKey } = component.onLoad ?? {};
    const { onChange, onItemSubmit, ...restTriggers } = triggers || {};
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle, inputStyle } = useBrandingStyles();
    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });
    const inputValue = useInputsStore((state) => state.getValue(componentId));
    const setInputValue = useInputsStore((state) => state.setInputValue);

    const [data, setData] = useState(
      dataType === "static" ? component.props?.data : [],
    );

    const { data: response } = useEndpoint({
      component,
      enabled: !!inputValue,
    });

    useEffect(() => {
      if (dataType === "dynamic") {
        if (!response || !dataLabelKey || !dataValueKey) {
          setData([]);
        } else {
          const list = Array.isArray(response) ? response : [response];
          setData(
            list.map((item: any) => ({
              label: String(item[dataLabelKey]),
              value: String(item[dataValueKey]),
            })),
          );
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultsKey, dataLabelKey, dataValueKey, dataType, response]);

    useEffect(() => {
      if (dataType === "static") {
        setData(component.props?.data ?? []);
      }
    }, [component.props?.data, dataType]);

    const [timeoutId, setTimeoutId] = useState(null);

    const handleChange = (value: any) => {
      console.log(value);
      setInputValue(componentId, value);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        if (onChange && value) {
          console.log("onChange", value);
          onChange(value);
        }
      }, 200);

      setTimeoutId(newTimeoutId as any);
    };

    const handleItemSubmit = (item: AutocompleteItem) => {
      // Submit value, display label
      onItemSubmit(item.value);
      // Need to be able to return the label so we can use in subsequent actions
      console.log("onItemSubmit", item.value, item.label);
      setInputValue(componentId, item.label);
    };

    return (
      <MantineAutocomplete
        ref={ref}
        {...props}
        {...componentProps}
        onChange={handleChange}
        onItemSubmit={handleItemSubmit}
        {...restTriggers}
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
        data={data}
        filter={() => true}
        dropdownComponent={CustomDropdown}
        rightSection={loading ? <InputLoader /> : null}
        label={undefined}
        value={inputValue}
      />
    );
  },
);
AutocompleteComponent.displayName = "Autocomplete";

export const Autocomplete = memo(
  withComponentWrapper<Props>(AutocompleteComponent),
  isSame,
);
