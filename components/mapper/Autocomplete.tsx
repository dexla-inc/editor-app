import { Icon } from "@/components/Icon";
import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEndpoint } from "@/hooks/useEndpoint";
import { EditableComponentMapper } from "@/utils/editor";
import {
  AutocompleteItem,
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo, useEffect, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

type Props = EditableComponentMapper & AutocompleteProps;

const AutocompleteComponent = forwardRef(
  ({ component, shareableContent, children: child, ...props }: Props, ref) => {
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
    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
    );
    const { dataLabelKey, dataValueKey, resultsKey } = onLoad ?? {};
    const { onChange, onItemSubmit, ...restTriggers } = triggers || {};
    const updateTreeComponentAttrs = useEditorTreeStore(
      (state) => state.updateTreeComponentAttrs,
    );

    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle, inputStyle } = useBrandingStyles();
    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });
    const inputValue = useComputeValue({
      componentId: component.id!,
      field: "value",
      shareableContent,
    });

    const [data, setData] = useState(
      dataType === "static" ? component.props?.data : [],
    );

    component.onLoad = onLoad;
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

    const handleChange = (item: any) => {
      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: {
          onLoad: {
            static: { label: item.label, value: item.value },
            dataType: "static",
          },
        },
        save: false,
      });

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
      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: {
          onLoad: {
            static: { label: item.label, value: item.value },
            dataType: "static",
          },
        },
        save: false,
      });
    };

    useEffect(() => {
      if (itemSubmitted && onItemSubmit && inputValue) {
        onItemSubmit && onItemSubmit(inputValue.value);
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
        value={inputValue?.label ?? inputValue}
      />
    );
  },
);
AutocompleteComponent.displayName = "Autocomplete";

export const Autocomplete = memo(
  withComponentWrapper<Props>(AutocompleteComponent),
);
