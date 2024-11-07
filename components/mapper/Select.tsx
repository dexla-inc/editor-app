import { Icon } from "@/components/Icon";
import { InputLoader } from "@/components/InputLoader";
import { CustomDropdown } from "@/components/mapper/CustomSelectDropdown";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useChangeState } from "@/hooks/components/useChangeState";
import { useEndpoint } from "@/hooks/components/useEndpoint";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useBrandingStyles } from "@/hooks/editor/useBrandingStyles";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Checkbox,
  Group,
  MultiSelect as MantineMultiSelect,
  Select as MantineSelect,
  MultiSelectProps,
  SelectProps,
  Stack,
  Text,
} from "@mantine/core";
import debounce from "lodash.debounce";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { forwardRef, memo } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & SelectProps & MultiSelectProps;

const SelectComponent = forwardRef(
  (
    {
      renderTree,
      component,
      children: child,
      shareableContent,
      ...props
    }: Props,
    ref,
  ) => {
    const isPreviewMode = useEditorTreeStore(
      useShallow((state) => state.isPreviewMode || state.isLive),
    );
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
      icon,
      openInEditor,
      customerFooter,
      customText,
      ...restComponentProps
    } = component.props as any;

    const { placeholder = component.props?.placeholder, nothingFound } =
      component?.onLoad;

    const componentProps = {
      ...restComponentProps,
      placeholder,
      nothingFound,
    };

    const MantineSelectWrapper = multiSelect
      ? MantineMultiSelect
      : MantineSelect;

    const [value, setValue] = useInputValue(
      {
        value: component.onLoad?.value,
      },
      props.id!,
    );

    const { dataLabelKey, dataValueKey, dataGroupKey, dataDescriptionKey } =
      component.onLoad;
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
          group: dataGroupKey ? String(item[dataGroupKey]) : undefined,
          description: dataDescriptionKey
            ? String(item[dataDescriptionKey])
            : undefined,
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
    const hasChildren = component.children && component.children?.length > 0;
    const hasCustomFooter = customerFooter && customText;
    const footer = hasChildren
      ? component.children?.map((child: any) =>
          renderTree?.(child, shareableContent),
        )
      : undefined;

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
        data={data}
        onChange={handleChange}
        onSearchChange={debouncedHandleSearchChange}
        {...restTriggers}
        style={{}}
        styles={{
          root: {
            position: "relative",
            ...pick(customStyle, rootStyleProps),
          },
          wrapper: {
            ...pick(customStyle, wrapperStyleProps),
          },
          input: {
            ...omit(customStyle, wrapperStyleProps),
            height: fetchHeight(customStyle),
          },
          values: { minHeight: customStyle.minHeight },
          rightSection: { pointerEvents: "none" },
        }}
        withinPortal={false}
        initiallyOpened={!isPreviewMode && openInEditor}
        disableSelectedItemFiltering
        maxDropdownHeight={maxDropdownHeight}
        {...(hasCustomFooter || hasChildren
          ? {
              dropdownComponent: (props: any) => (
                <CustomDropdown {...props} footer={footer} />
              ),
            }
          : {})}
        itemComponent={(props: any) => (
          <SelectItem {...props} multiSelect={multiSelect} />
        )}
        rightSection={
          loading ? <InputLoader /> : icon ? <Icon name={icon} /> : null
        }
        label={undefined}
        value={typeof value === "number" ? String(value) : value}
        wrapperProps={{ "data-id": props.id }}
        data-mantine-stop-propagation
      />
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

const SelectItem = forwardRef<HTMLDivElement, any>(
  ({ label, value, description, multiSelect, ...others }: any, ref) => {
    const { "data-selected": dataSelected, ...rest } = others;
    const props = multiSelect ? rest : others;
    return (
      <Group noWrap ref={ref} {...props} tabIndex={-1}>
        {multiSelect && (
          <Checkbox checked={dataSelected} onChange={() => {}} tabIndex={-1} />
        )}
        <Stack spacing={0}>
          <Text>{label}</Text>
          {description && (
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          )}
        </Stack>
      </Group>
    );
  },
);
