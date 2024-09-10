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
  Avatar,
  Group,
  Autocomplete as MantineAutocomplete,
  MantineColor,
  SelectItemProps,
  Text,
} from "@mantine/core";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { forwardRef, memo, useEffect, useState, useCallback } from "react";
import { useInputValue } from "@/hooks/components/useInputValue";
import debounce from "lodash.debounce";

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

    const [value, setValue] = useInputValue<string>(
      {
        value: component.onLoad?.value ?? "",
      },
      props.id!,
    );

    const {
      dataLabelKey,
      dataValueKey,
      isAdvanced,
      dataDescriptionKey,
      dataImageKey,
    } = component.onLoad ?? {};
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
      enabled: true,
    });

    const [data, setData] = useState<AutocompleteItem[]>([]);
    const [filteredData, setFilteredData] = useState<AutocompleteItem[]>([]);

    useEffect(() => {
      if (dataType === "dynamic" && response) {
        const list = Array.isArray(response) ? response : [response];

        const formattedData = list.map((item: any) => {
          const baseData = {
            label: String(item[dataLabelKey]),
            value: String(item[dataValueKey]),
          };

          if (isAdvanced) {
            return {
              ...baseData,
              image: String(item[dataImageKey]),
              description: String(item[dataDescriptionKey]),
            };
          }

          return baseData;
        });

        setData(formattedData);
      } else if (dataType === "static") {
        setData(component.onLoad?.data ?? component.props?.data ?? []);
      }
    }, [
      response,
      dataType,
      dataLabelKey,
      dataValueKey,
      isAdvanced,
      dataImageKey,
      dataDescriptionKey,
    ]);

    // Debounced filter function
    const debouncedFilter = useCallback(
      debounce((value: string) => {
        const filtered = data.filter((item) =>
          item.label?.toLowerCase().includes(value?.toLowerCase()?.trim()),
        );
        setFilteredData(filtered);
      }, 2000),
      [data],
    );

    // Use useEffect to call the debounced function
    useEffect(() => {
      debouncedFilter(value);
      // Cancel the debounce on useEffect cleanup
      return () => debouncedFilter.cancel();
    }, [value, debouncedFilter]);

    const handleChange = (item: string) => {
      setValue(item);
      onChange && onChange(item);
    };

    const handleItemSubmit = (item: string) => {
      setValue(item);
      onItemSubmit && onItemSubmit(item);
    };

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
        data={filteredData}
        filter={() => true} // We're handling filtering ourselves
        dropdownComponent={CustomDropdown}
        rightSection={loading || isLoading ? <InputLoader /> : null}
        label={undefined}
        value={value}
        {...(isAdvanced ? { itemComponent: AutoCompleteItem } : {})}
      />
    );
  },
);
AutocompleteComponent.displayName = "Autocomplete";

export const Autocomplete = memo(
  withComponentWrapper<Props>(AutocompleteComponent),
);

interface ItemProps extends SelectItemProps {
  color: MantineColor;
  description: string;
  image: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ description, label, image, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        {image && image != "undefined" && <Avatar src={image} />}

        <div>
          {label && label != "undefined" && <Text>{label}</Text>}
          {description && description != "undefined" && (
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          )}
        </div>
      </Group>
    </div>
  ),
);
