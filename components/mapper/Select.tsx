import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEndpoint } from "@/hooks/useEndpoint";
import { useInputsStore } from "@/stores/inputs";
import { isSame } from "@/utils/componentComparison";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Box,
  MultiSelect as MantineMultiSelect,
  Select as MantineSelect,
  MultiSelectProps,
  SelectProps,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { Fragment, forwardRef, memo, useEffect, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";

type Props = EditableComponentMapper & SelectProps & MultiSelectProps;

const SelectComponent = forwardRef(
  ({ component, children: child, isPreviewMode, ...props }: Props, ref) => {
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
    const MantineSelectParentWrapper =
      multiSelect && !isPreviewMode ? Box : Fragment;

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
    const inputValue = useInputsStore((state) => state.getValue(componentId));
    const setInputValue = useInputsStore((state) => state.setInputValue);

    const [data, setData] = useState(
      dataType === "static" ? component.props?.data : [],
    );

    component.onLoad = onLoad;
    const { data: response } = useEndpoint({
      component,
    });

    const handleChange = (value: any) => {
      onChange && setInputValue(componentId, value);
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

    return (
      <MantineSelectParentWrapper {...omit(props, ["onChange"])}>
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
              ...pick(customStyle, [
                "display",
                "width",
                "height",
                "minHeight",
                "minWidth",
              ]),
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
        />
      </MantineSelectParentWrapper>
    );
  },
);
SelectComponent.displayName = "Select";

export const Select = memo(
  withComponentWrapper<Props>(SelectComponent),
  isSame,
);
