import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useInputValue } from "@/hooks/components/useInputValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { isPreviewModeSelector } from "@/utils/componentSelectors";
import { inputSizes, radiusSizes } from "@/utils/defaultSizes";
import { EditableComponentMapper } from "@/utils/editor";
import {
  ColorSwatchProps,
  Input,
  ColorPicker as MantineColorPicker,
  ColorSwatch as MantineColorSwatch,
  Popover as MantinePopover,
  Stack,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & Omit<ColorSwatchProps, "color">;

const ColorPickerComponent = forwardRef<HTMLDivElement, Props>(
  (
    {
      renderTree,
      shareableContent,
      component,
      grid: { ChildrenWrapper },
      ...props
    },
    ref,
  ) => {
    const isPreviewMode = useEditorTreeStore(isPreviewModeSelector);
    const {
      triggers,
      size: mantineSize,
      radius: mantineRadius,
      ...componentProps
    } = component.props ?? {};
    const { onChange: onChangeColor, ...otherTriggers } = triggers ?? {};
    const [value, setValue] = useInputValue<string>(
      {
        value: component.onLoad?.children,
      },
      props.id!,
    );

    const size = inputSizes[mantineSize];
    const radius = radiusSizes[mantineRadius];

    const onChange = (value: string) => {
      setValue(value);
      onChangeColor?.({ target: { value } });
    };

    const targetcomponent = (
      <MantineColorSwatch
        ref={ref}
        color={value}
        size={size}
        radius={radius}
        {...componentProps}
        {...props}
        {...otherTriggers}
      />
    );

    if (!isPreviewMode) {
      return targetcomponent;
    }

    return (
      <MantinePopover>
        <MantinePopover.Target>
          <ChildrenWrapper>{targetcomponent}</ChildrenWrapper>
        </MantinePopover.Target>
        <MantinePopover.Dropdown>
          <Stack>
            <MantineColorPicker
              format="hexa"
              value={value}
              onChange={onChange}
            />
            <Input
              size="sm"
              value={value}
              mt="sm"
              placeholder="#FFFFFF"
              onChange={(e) => onChange(e.currentTarget.value)}
            />
          </Stack>
        </MantinePopover.Dropdown>
      </MantinePopover>
    );
  },
);

ColorPickerComponent.displayName = "ColorPicker";

export const ColorPicker = memo(
  withComponentWrapper<Props>(ColorPickerComponent),
);
