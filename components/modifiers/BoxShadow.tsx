import {
  CardStyleProps,
  CardStyleSelector,
  getCardStyling,
} from "@/components/CardStyleSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { UnitInput } from "@/components/UnitInput";
import { getThemeColor } from "@/components/modifiers/Border";
import { withModifier } from "@/hoc/withModifier";
import { CardStyle } from "@/requests/projects/types";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Flex, SegmentedControl, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconShadow } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconShadow;
export const label = "Shadow";

export const defaultBoxShadowValues = {
  inset: "",
  xOffset: "0px",
  yOffset: "0px",
  blur: "0px",
  spread: "0px",
  color: "Black.9",
  boxShadow: "",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const { theme, setTheme } = useEditorStore((state) => ({
      theme: state.theme,
      setTheme: state.setTheme,
    }));

    let { style = {} } = selectedComponent.props!;
    const boxShadow =
      style.boxShadow ?? Object.values(defaultBoxShadowValues).join(" ");

    const values = boxShadow.split(/\s+/);

    const inset = values[0] === "inset" ? "inset" : "";
    const xOffset = values[1];
    const yOffset = values[2];
    const blur = values[3];
    const spread = values[4];
    const color = values.slice(5).join(" ");

    const form = useForm({
      initialValues: merge({}, defaultBoxShadowValues, {
        inset,
        xOffset,
        yOffset,
        blur,
        spread,
        color: getThemeColor(theme, color),
      }),
    });

    return (
      <form key={selectedComponent?.id}>
        {selectedComponent?.name === "Card" ? (
          <CardStyleSelector
            value={theme.cardStyle}
            onChange={(value) => {
              const cardStyles = getCardStyling(
                value as CardStyle,
                theme.colors["Border"][6],
                theme.defaultRadius,
              );

              setTheme({
                ...theme,
                cardStyle: value as CardStyle,
              });

              Object.keys(cardStyles).forEach((key) => {
                const styleKey = key as keyof CardStyleProps;
                form.setFieldValue(styleKey, cardStyles[styleKey]);
              });

              debouncedTreeUpdate(selectedComponentIds, {
                style: cardStyles,
              });
            }}
          />
        ) : (
          <Stack spacing="xs">
            <Stack spacing={0}>
              <Text size="xs" fw={500}>
                Offset
              </Text>
              <SegmentedControl
                size="xs"
                data={[
                  { label: "Outside", value: "" },
                  { label: "Inside", value: "inset" },
                ]}
                {...form.getInputProps("inset")}
                onChange={(value) => {
                  form.setFieldValue("inset", value as string);
                  const boxShadow = `${value} ${form.values.xOffset} ${form.values.yOffset} ${form.values.blur} ${form.values.spread} ${form.values.color}`;

                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { boxShadow },
                  });
                }}
              />
            </Stack>
            <Flex gap="xs">
              <UnitInput
                label="X Offset"
                {...form.getInputProps("xOffset")}
                onChange={(value) => {
                  form.setFieldValue("xOffset", value as string);
                  const boxShadow = `${form.values.inset} ${value} ${form.values.yOffset} ${form.values.blur} ${form.values.spread} ${form.values.color}`;

                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { boxShadow },
                  });
                }}
                options={[
                  { value: "px", label: "PX" },
                  { value: "rem", label: "REM" },
                  { value: "%", label: "%" },
                ]}
              />
              <UnitInput
                label="Y Offset"
                {...form.getInputProps("yOffset")}
                onChange={(value) => {
                  form.setFieldValue("yOffset", value as string);
                  const boxShadow = `${form.values.inset} ${form.values.xOffset} ${value} ${form.values.blur} ${form.values.spread} ${form.values.color}`;

                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { boxShadow },
                  });
                }}
                options={[
                  { value: "px", label: "PX" },
                  { value: "rem", label: "REM" },
                  { value: "%", label: "%" },
                ]}
              />
            </Flex>
            <Flex gap="xs">
              <UnitInput
                label="Blur"
                {...form.getInputProps("blur")}
                onChange={(value) => {
                  form.setFieldValue("blur", value as string);
                  const boxShadow = `${form.values.inset} ${form.values.xOffset} ${form.values.yOffset} ${value} ${form.values.spread} ${form.values.color}`;

                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { boxShadow },
                  });
                }}
                options={[
                  { value: "px", label: "PX" },
                  { value: "rem", label: "REM" },
                  { value: "%", label: "%" },
                ]}
              />
              <UnitInput
                label="Spread"
                {...form.getInputProps("spread")}
                onChange={(value) => {
                  form.setFieldValue("spread", value as string);
                  const boxShadow = `${form.values.inset} ${form.values.xOffset} ${form.values.yOffset} ${form.values.blur} ${value} ${form.values.color}`;

                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { boxShadow },
                  });
                }}
                options={[
                  { value: "px", label: "PX" },
                  { value: "rem", label: "REM" },
                  { value: "%", label: "%" },
                ]}
              />
            </Flex>
            <ThemeColorSelector
              label="Color"
              {...form.getInputProps("color")}
              onChange={(_value: string) => {
                const [color, index] = _value.split(".");
                // @ts-ignore
                const value = theme.colors[color][index];

                form.setFieldValue("color", _value);
                const boxShadow = `${form.values.inset} ${form.values.xOffset} ${form.values.yOffset} ${form.values.blur} ${form.values.spread} ${value}`;

                debouncedTreeUpdate(selectedComponentIds, {
                  style: { boxShadow },
                });
              }}
            />
          </Stack>
        )}
      </form>
    );
  },
);
