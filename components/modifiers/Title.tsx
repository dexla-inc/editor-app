import { ThemeColorSelector } from "@/components/ThemeColorSelector";
import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconH1 } from "@tabler/icons-react";
import { useEffect } from "react";
import merge from "lodash.merge";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";

export const icon = IconH1;
export const label = "Title";

export const Modifier = withModifier(
  ({ selectedComponent, componentProps, language, currentState }) => {
    const theme = useEditorStore((state) => state.theme);

    const form = useForm({
      initialValues: {
        value: "",
        color: "Black.6",
        order: "1",
      },
    });

    useEffect(() => {
      if (selectedComponent?.id) {
        const data = pick(componentProps, ["children", "order", "color"]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          value: data.children,
          order: data.order?.toString() ?? "1",
          color: data.color ?? "Black.6",
        });
      }
      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent?.id, currentState, language]);

    return (
      <form>
        <Stack spacing="xs">
          <Textarea
            autosize
            label="Value"
            size="xs"
            {...form.getInputProps("value")}
            onChange={(e) => {
              form.setFieldValue("value", e.target.value);
              debouncedTreeComponentPropsUpdate("children", e.target.value);
            }}
          />
          <Select
            label="Order"
            size="xs"
            data={[
              { label: "H1", value: "1" },
              { label: "H2", value: "2" },
              { label: "H3", value: "3" },
              { label: "H4", value: "4" },
              { label: "H5", value: "5" },
              { label: "H6", value: "6" },
            ]}
            {...form.getInputProps("order")}
            onChange={(value) => {
              // @ts-ignore
              const size = theme.headings.sizes[`h${value}`];
              form.setFieldValue("order", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                order: parseInt(value as string, 10),
                style: {
                  fontSize: size.fontSize,
                  lineHeight: size.lineHeight,
                },
              });
            }}
          />
          <ThemeColorSelector
            label="Color"
            {...form.getInputProps("color")}
            onChange={(value: string) => {
              form.setFieldValue("color", value);
              debouncedTreeComponentPropsUpdate("color", value);
            }}
          />
        </Stack>
      </form>
    );
  }
);
