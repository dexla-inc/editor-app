import {
  CardStyleProps,
  CardStyleSelector,
  getCardStyling,
} from "@/components/CardStyleSelector";
import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { CardStyle } from "@/requests/projects/types";
import { useThemeStore } from "@/stores/theme";
import {
  debouncedTreeComponentAttrsUpdate,
  getColorFromTheme,
  getThemeColor,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Flex, SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const defaultBoxShadowValues = requiredModifiers.boxShadow;

const Modifier = withModifier(({ selectedComponent }) => {
  const theme = useThemeStore((state) => state.theme);
  const isCardComponent = selectedComponent?.name === "Card";

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

  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, defaultBoxShadowValues, {
        inset,
        xOffset,
        yOffset,
        blur,
        spread,
        color: getThemeColor(theme, color),
        ...(isCardComponent && {
          cardStyle: selectedComponent?.props?.cardStyle ?? "ROUNDED",
        }),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form key={selectedComponent?.id}>
      {isCardComponent ? (
        <CardStyleSelector
          value={(form.values.cardStyle ?? theme.cardStyle) as CardStyle}
          onChange={(value) => {
            const cardStyles = getCardStyling(
              value as CardStyle,
              theme.colors["Border"][6],
              theme.defaultRadius,
            );

            Object.keys(cardStyles).forEach((key) => {
              const styleKey = key as keyof CardStyleProps;
              form.setFieldValue(styleKey, cardStyles[styleKey]);
            });

            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { style: cardStyles, cardStyle: value } },
            });
          }}
        />
      ) : (
        <Stack spacing="xs">
          <Stack spacing={0}>
            <TopLabel text="Offset" />
            <SegmentedControl
              size="xs"
              data={[
                { label: "Outside", value: "" },
                { label: "Inside", value: "inset" },
              ]}
              {...form.getInputProps("inset")}
              onChange={(value) => {
                form.setFieldValue("inset", value as string);
                const boxShadow = `${value} ${xOffset} ${yOffset} ${blur} ${spread} ${color}`;
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      style: { boxShadow },
                    },
                  },
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
                const boxShadow = `${inset} ${value} ${yOffset} ${blur} ${spread} ${color}`;
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      style: { boxShadow },
                    },
                  },
                });
              }}
              options={[
                { value: "px", label: "PX" },
                { value: "%", label: "%" },
              ]}
            />
            <UnitInput
              label="Y Offset"
              {...form.getInputProps("yOffset")}
              onChange={(value) => {
                form.setFieldValue("yOffset", value as string);
                const boxShadow = `${inset} ${xOffset} ${value} ${blur} ${spread} ${color}`;
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      style: { boxShadow },
                    },
                  },
                });
              }}
              options={[
                { value: "px", label: "PX" },
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
                const boxShadow = `${inset} ${xOffset} ${yOffset} ${value} ${spread} ${color}`;
                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      style: { boxShadow },
                    },
                  },
                });
              }}
              options={[
                { value: "px", label: "PX" },
                { value: "%", label: "%" },
              ]}
            />
            <UnitInput
              label="Spread"
              {...form.getInputProps("spread")}
              onChange={(value) => {
                form.setFieldValue("spread", value as string);
                const boxShadow = `${inset} ${xOffset} ${yOffset} ${blur} ${value} ${color}`;

                debouncedTreeComponentAttrsUpdate({
                  attrs: {
                    props: {
                      style: { boxShadow },
                    },
                  },
                });
              }}
              options={[
                { value: "px", label: "PX" },
                { value: "%", label: "%" },
              ]}
            />
          </Flex>
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(_value: string) => {
              const value = getColorFromTheme(theme, _value);
              form.setFieldValue("color", _value);
              const boxShadow = `${inset} ${xOffset} ${yOffset} ${blur} ${spread} ${value}`;

              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    style: { boxShadow },
                  },
                },
              });
            }}
          />
        </Stack>
      )}
    </form>
  );
});

export default Modifier;
