import { Icon } from "@/components/Icon";
import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { EditableComponentMapper } from "@/utils/editor";
import {
  AutocompleteItem,
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo, useEffect, useState } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";

type Props = EditableComponentMapper & AutocompleteProps;

const AutocompleteComponent = forwardRef(
  ({ component, shareableContent, children: child, ...props }: Props, ref) => {
    const {
      children,
      triggers,
      loading,
      dataType = "static",
      bg,
      textColor,
      iconName,
      ...restComponentProps
    } = component.props as any;

    const { placeholder = component.props?.placeholder } = component?.onLoad;

    const componentProps = { ...restComponentProps, placeholder };

    const [value, setValue] = useInputValue<AutocompleteItem>(
      {
        value: component.onLoad?.value ?? "",
      },
      props.id!,
    );

    const { dataLabelKey, dataValueKey } = component.onLoad ?? {};
    const { onChange, onItemSubmit, ...restTriggers } = triggers || {};

    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle, inputStyle } = useBrandingStyles();
    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });

    const { data: response, isLoading } = useEndpoint({
      componentId: component.id!,
      onLoad: component.onLoad,
      dataType,
      enabled: !!value,
    });

    let data = [];

    if (dataType === "dynamic") {
      if (response && dataLabelKey && dataValueKey) {
        const list = Array.isArray(response) ? response : [response];
        data = list.map((item: any) => ({
          label: String(item[dataLabelKey]),
          value: String(item[dataValueKey]),
        }));
      }
    }

    if (dataType === "static") {
      data = component.onLoad?.data ?? component.props?.data ?? [];
    }

    const [timeoutId, setTimeoutId] = useState(null);

    const handleChange = (item: any) => {
      setValue(item);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        if (onChange && item) {
          onChange(item);
        }
      }, 200);

      setTimeoutId(newTimeoutId as any);
    };

    const [itemSubmitted, setItemSubmitted] = useState(false);

    const handleItemSubmit = (item: AutocompleteItem) => {
      setItemSubmitted(true);
      setValue(item);
    };

    useEffect(() => {
      if (itemSubmitted && onItemSubmit && value) {
        onItemSubmit && onItemSubmit(value?.value);
        setItemSubmitted(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemSubmitted]);

    return (
      <MantineAutocomplete
        ref={ref}
        {...props}
        wrapperProps={{ "data-id": component.id }}
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
        value={value?.label ?? value}
      />
    );
  },
);
AutocompleteComponent.displayName = "Autocomplete";

export const Autocomplete = memo(
  withComponentWrapper<Props>(AutocompleteComponent),
);
