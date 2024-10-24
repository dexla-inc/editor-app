import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { EditableComponentMapper } from "@/utils/editor";
import {
  MultiSelect as MantineMultiSelect,
  Select as MantineSelect,
  MultiSelectProps,
  SelectProps,
  Box,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";

type Props = EditableComponentMapper & SelectProps & MultiSelectProps;

const SelectComponent = forwardRef(
  (
    {
      component,
      children: child,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const {
      children,
      triggers,
      loading,
      dataType = "static",
      bg,
      size,
      textColor,
      multiSelect,
      maxDropdownHeight,
      ...restComponentProps
    } = component.props as any;

    const { placeholder = component.props?.placeholder } = component?.onLoad;

    const componentProps = { ...restComponentProps, placeholder };

    const MantineSelectWrapper = multiSelect
      ? MantineMultiSelect
      : MantineSelect;

    const [value, setValue] = useInputValue(
      {
        value: component.onLoad?.value,
      },
      props.id!,
    );

    const { dataLabelKey, dataValueKey } = component.onLoad;
    const { onChange, onSearchChange, ...restTriggers } = triggers || {};
    const { color, backgroundColor } = useChangeState({ bg, textColor });
    const { borderStyle, inputStyle } = useBrandingStyles();
    const customStyle = merge(
      { minHeight: inputStyle?.height },
      borderStyle,
      inputStyle,
      props.style,
      {
        backgroundColor,
        color,
      },
    );

    const { data: response } = useEndpoint({
      componentId: component.id!,
      onLoad: component.onLoad,
      dataType,
    });

    const handleChange = (value: string) => {
      setValue(value);
      onChange?.({ target: { value } });
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
      data = component.onLoad?.data ?? component.props?.data ?? [];
    }

    const rootStyleProps = [
      "display",
      "width",
      "minHeight",
      "minWidth",
      "maxWidth",
      "maxHeight",
    ];
    const wrapperStyleProps = [
      "margin",
      "marginBottom",
      "marginTop",
      "marginLeft",
      "marginRight",
    ];

    return (
      <Box unstyled style={props.style as any} {...props} {...restTriggers}>
        <MantineSelectWrapper
          {...omit(componentProps, [
            "customText",
            "customLinkText",
            "customLinkUrl",
            "labelAlign",
          ])}
          // @ts-ignore
          onChange={handleChange}
          onSearchChange={debouncedHandleSearchChange}
          style={{}}
          styles={{
            root: {
              position: "relative",
              ...pick(customStyle, rootStyleProps),
              width: "100%",
              height: "100%",
              display: "flex",
              gridArea: "1 / 1 / -1 / -1",
            },
            wrapper: {
              ...pick(customStyle, wrapperStyleProps),
              width: "100%",
              height: "100%",
            },
            input: {
              ...omit(customStyle, wrapperStyleProps),
              height: fetchHeight(customStyle),
              width: "100%",
              // height: "100%",
            },
            values: { minHeight: customStyle.minHeight },
          }}
          withinPortal={false}
          maxDropdownHeight={maxDropdownHeight}
          data={data}
          {...(component.props?.customText
            ? {
                dropdownComponent: CustomDropdown,
              }
            : {})}
          rightSection={loading ? <InputLoader /> : null}
          label={undefined}
          value={typeof value === "number" ? String(value) : value}
          wrapperProps={{ "data-id": props.id }}
        />
        <ChildrenWrapper />
      </Box>
    );
  },
);
SelectComponent.displayName = "Select";

export const Select = memo(withComponentWrapper<Props>(SelectComponent));

const fetchHeight = (style: any) => {
  const { minHeight = "auto" } = style;
  const match = minHeight.match(/\d+/);
  return match && parseInt(match[0]) < 36 ? minHeight : "inherit";
};
