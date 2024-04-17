import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/useBrandingStyles";
import { useChangeState } from "@/hooks/useChangeState";
import { useEndpoint } from "@/hooks/useEndpoint";
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
import { useInputValue } from "@/hooks/useInputValue";

type Props = EditableComponentMapper & SelectProps & MultiSelectProps;

const SelectComponent = forwardRef(
  ({ component, children: child, shareableContent, ...props }: Props, ref) => {
    const {
      children,
      triggers,
      loading,
      dataType,
      bg,
      size,
      textColor,
      multiSelect,
      ...componentProps
    } = component.props as any;

    const MantineSelectWrapper = multiSelect
      ? MantineMultiSelect
      : MantineSelect;

    const [value, setValue] = useInputValue(
      {
        value: component.onLoad?.value ?? "",
      },
      component.id!,
    );

    const { dataLabelKey, dataValueKey } = component.onLoad;
    const { onChange, onSearchChange, ...restTriggers } = triggers || {};
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle, inputStyle } = useBrandingStyles();
    const customStyle = merge({}, borderStyle, inputStyle, props.style, {
      backgroundColor,
      color,
    });

    const { data: response } = useEndpoint({
      onLoad: component.onLoad,
      dataType,
    });

    const handleChange = (value: string) => {
      setValue(value);
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

    const rootStyleProps = ["display", "width", "minHeight", "minWidth"];

    return (
      <MantineSelectWrapper
        ref={ref}
        {...props}
        {...omit(componentProps, [
          "customText",
          "customLinkText",
          "customLinkUrl",
          "labelAlign",
        ])}
        onChange={handleChange}
        onSearchChange={debouncedHandleSearchChange}
        {...restTriggers}
        style={{}}
        styles={{
          root: {
            position: "relative",
            ...pick(customStyle, rootStyleProps),
          },
          input: { ...customStyle, minHeight: "auto" },
          values: { height: "inherit" },
        }}
        withinPortal={false}
        maxDropdownHeight={150}
        data={data}
        dropdownComponent={CustomDropdown}
        rightSection={loading ? <InputLoader /> : null}
        label={undefined}
        value={typeof value === "number" ? String(value) : value}
        wrapperProps={{ "data-id": component.id }}
      />
    );
  },
);
SelectComponent.displayName = "Select";

export const Select = memo(withComponentWrapper<Props>(SelectComponent));
