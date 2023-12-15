import { SpacingControl } from "@/components/modifiers/SpacingControl";
import { withModifier } from "@/hoc/withModifier";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel2 } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconBoxModel2;
export const label = "Spacing";

type SpacingeModifierProps = {
  showPadding: "padding-all" | "padding-sides";
  showMargin: "margin-all" | "margin-sides";
  padding: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  margin: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const initialValues = requiredModifiers.spacing;
    const style = selectedComponent?.props?.style;

    const isPaddingAllSame =
      style?.paddingTop === style?.paddingBottom &&
      style?.paddingTop === style?.paddingLeft &&
      style?.paddingTop === style?.paddingRight;

    const isMarginAllSame =
      style?.marginTop === style?.marginBottom &&
      style?.marginTop === style?.marginLeft &&
      style?.marginTop === style?.marginRight;

    const form = useForm<SpacingeModifierProps>({
      initialValues: {
        showPadding: isPaddingAllSame ? "padding-all" : "padding-sides",
        showMargin: isMarginAllSame ? "margin-all" : "margin-sides",
        padding: "0px",
        margin: "0px",
        ...initialValues,
      },
    });

    useEffect(() => {
      form.setValues(
        merge(
          {},
          {
            padding: selectedComponent?.props?.style?.padding,
            paddingTop:
              selectedComponent?.props?.style?.paddingTop ??
              selectedComponent?.props?.style?.padding,
            paddingBottom:
              selectedComponent?.props?.style?.paddingBottom ??
              selectedComponent?.props?.style?.padding,
            paddingLeft:
              selectedComponent?.props?.style?.paddingLeft ??
              selectedComponent?.props?.style?.padding,
            paddingRight:
              selectedComponent?.props?.style?.paddingRight ??
              selectedComponent?.props?.style?.padding,
            margin: selectedComponent?.props?.style?.margin,
            marginTop:
              selectedComponent?.props?.style?.marginTop ??
              selectedComponent?.props?.style?.margin,
            marginBottom:
              selectedComponent?.props?.style?.marginBottom ??
              selectedComponent?.props?.style?.margin,
            marginLeft:
              selectedComponent?.props?.style?.marginLeft ??
              selectedComponent?.props?.style?.margin,
            marginRight:
              selectedComponent?.props?.style?.marginRight ??
              selectedComponent?.props?.style?.margin,
          },
        ),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form key={selectedComponent?.id}>
        <Stack spacing="xs">
          <SpacingControl
            type="Padding"
            form={form}
            selectedComponentIds={selectedComponentIds}
          />
          {selectedComponent?.name !== "GridColumn" && (
            <SpacingControl
              type="Margin"
              form={form}
              selectedComponentIds={selectedComponentIds}
            />
          )}
        </Stack>
      </form>
    );
  },
);
