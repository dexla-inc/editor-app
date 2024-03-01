import { Icon } from "@/components/Icon";
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
      iconName,
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

    const { data: response, isLoading } = useEndpoint({
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
      setInputValue(componentId, value);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        if (onChange && value) {
          onChange(value);
        }
      }, 200);

      setTimeoutId(newTimeoutId as any);
    };

    const [itemSubmitted, setItemSubmitted] = useState(false);

    const handleItemSubmit = (item: AutocompleteItem) => {
      setItemSubmitted(true);
      setInputValue(componentId, { label: item.label, value: item.value });
    };

    useEffect(() => {
      if (itemSubmitted && onItemSubmit && inputValue) {
        onItemSubmit && onItemSubmit(inputValue.value);
        setItemSubmitted(false);
      }
    }, [itemSubmitted]);

    return (
      <MantineAutocomplete
        ref={ref}
        {...props}
        {...componentProps}
        onChange={handleChange}
        onItemSubmit={handleItemSubmit}
        {...restTriggers}
        icon={iconName ? <Icon name={iconName} /> : null}
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
        rightSection={loading || isLoading ? <InputLoader /> : null}
        label={undefined}
        value={inputValue?.label ?? inputValue}
      />
    );
  },
);
AutocompleteComponent.displayName = "Autocomplete";

export const Autocomplete = memo(
  withComponentWrapper<Props>(AutocompleteComponent),
  isSame,
);
