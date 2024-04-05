import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import {
  MultiSelect as MantineMultiSelect,
  Select as MantineSelect,
  MultiSelectProps,
  SelectProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { memoize } from "proxy-memoize";
import { forwardRef, memo, useEffect, useState } from "react";

type Props = EditableComponentMapper & SelectProps & MultiSelectProps;

const SelectComponent = forwardRef(
  (
    {
      component,
      children: child,
      isPreviewMode,
      shareableContent,
      ...props
    }: Props,
    ref,
  ) => {
    const updateTreeComponentAttrs = useEditorTreeStore(
      (state) => state.updateTreeComponentAttrs,
    );

    const {
      children,
      triggers,
      loading,
      dataType,
      bg,
      textColor,
      multiSelect,
      ...componentProps
    } = component.props as any;

    const MantineSelectWrapper = multiSelect
      ? MantineMultiSelect
      : MantineSelect;

    const componentId = component.id as string;
    const onLoad = useEditorTreeStore(
      memoize((state) => state.componentMutableAttrs[component?.id!]?.onLoad),
    );

    const { dataLabelKey, dataValueKey, resultsKey } = onLoad ?? {};
    const { onChange, onSearchChange, ...restTriggers } = triggers || {};
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
    const { data: response } = useEndpoint({
      component,
    });

    const handleChange = (value: any) => {
      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: { onLoad: { static: value, dataType: "static" } },
        save: false,
      });
      onChange?.(value);
    };

    const debouncedHandleSearchChange = debounce((value) => {
      onSearchChange && onSearchChange(value);
    }, 200);

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

    useEffect(() => {
      onChange && onChange(inputValue);
    }, [inputValue, onChange]);

    const rootStyleProps = [
      "display",
      "width",
      "height",
      "minHeight",
      "minWidth",
    ];

    return (
      <MantineSelectWrapper
        ref={ref}
        {...props}
        {...componentProps}
        onChange={handleChange}
        onSearchChange={debouncedHandleSearchChange}
        {...restTriggers}
        style={{}}
        styles={{
          root: {
            position: "relative",
            ...pick(customStyle, rootStyleProps),
          },
          input: customStyle,
          values: { height: "inherit" },
        }}
        withinPortal={false}
        maxDropdownHeight={150}
        data={data}
        dropdownComponent={CustomDropdown}
        rightSection={loading ? <InputLoader /> : null}
        label={undefined}
        value={inputValue}
        wrapperProps={{ "data-id": component.id }}
      />
    );
  },
);
SelectComponent.displayName = "Select";

export const Select = memo(
  withComponentWrapper<Props>(SelectComponent),
  isSame,
);
