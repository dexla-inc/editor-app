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

    const [typingValue, setTypingValue] = useState(value);

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
      enabled: !!value,
    });

    let data = [];

    if (dataType === "dynamic" && response) {
      const list = Array.isArray(response) ? response : [response];

      data = list.map((item: any) => {
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
    }

    if (dataType === "static") {
      data = component.onLoad?.data ?? component.props?.data ?? [];
    }

    const [timeoutId, setTimeoutId] = useState(null);

    const handleChange = (item: any) => {
      setTypingValue(item);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        setValue(item);
        if (onChange && item) {
          onChange(item);
        }
      }, 800);

      setTimeoutId(newTimeoutId as any);
    };

    const [itemSubmitted, setItemSubmitted] = useState(false);

    const handleItemSubmit = (item: AutocompleteItem) => {
      setItemSubmitted(true);
      setTypingValue(item);
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
        value={typingValue?.label ?? typingValue}
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
