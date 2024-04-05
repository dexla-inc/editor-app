import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEndpoint } from "@/hooks/useEndpoint";
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
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { memoize } from "proxy-memoize";
import { useComputeValue } from "@/hooks/dataBinding/useComputeValue";

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
      memoize(
        (state) => state.componentMutableAttrs[component?.id!]?.onLoad ?? {},
      ),
    );

    const { dataLabelKey, dataValueKey } = onLoad;
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

    const { data: response } = useEndpoint({
      onLoad,
      dataType,
    });

    const handleChange = (value: string) => {
      updateTreeComponentAttrs({
        componentIds: [componentId],
        attrs: { onLoad: { value: { static: value, dataType: "static" } } },
        save: false,
      });
      onChange?.(value);
    };

    const debouncedHandleSearchChange = debounce((value) => {
      onSearchChange?.(value);
    }, 200);

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
      data = component.props?.data ?? [];
    }

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
