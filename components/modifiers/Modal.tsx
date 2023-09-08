import { useEditorStore } from "@/stores/editor";
import {
  debouncedTreeComponentPropsUpdate,
  getComponentById,
} from "@/utils/editor";
import { Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxModel } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";

export const icon = IconBoxModel;
export const label = "Modal";

export const defaultModalValues = {
  title: "Modal Title",
};

export const Modifier = withModifier(
  ({ selectedComponent, componentProps, language, currentState }) => {
    const form = useForm({
      initialValues: {
        title: defaultModalValues.title,
      },
    });

    useEffect(() => {
      if (selectedComponent?.id) {
        const data = pick(componentProps, ["title"]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          title: data.title ?? defaultModalValues.title,
        });
      }
      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent?.id]);

    return (
      <form>
        <Stack spacing="xs">
          <Textarea
            autosize
            label="Title"
            size="xs"
            {...form.getInputProps("title")}
            onChange={(e) => {
              form.setFieldValue("title", e.target.value);
              debouncedTreeComponentPropsUpdate("title", e.target.value);
            }}
          />
        </Stack>
      </form>
    );
  }
);
