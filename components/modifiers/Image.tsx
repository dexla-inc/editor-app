import { useEditorStore } from "@/stores/editor";
import { debouncedTreeUpdate, getComponentById } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPhoto } from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import merge from "lodash.merge";

export const icon = IconPhoto;
export const label = "Image";

export const defaultImageValues = {
  src: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png",
  alt: "",
  fit: "contain",
  position: "relative",
};

export const Modifier = withModifier(
  ({ selectedComponent, componentProps, language, currentState }) => {
    const form = useForm({
      initialValues: defaultImageValues,
    });

    useEffect(() => {
      if (selectedComponent?.id) {
        const data = pick(componentProps, ["src", "alt", "style"]);

        merge(
          data,
          language !== "default"
            ? selectedComponent?.languages?.[language]?.[currentState]
            : selectedComponent?.states?.[currentState]
        );

        form.setValues({
          src: data.src ?? defaultImageValues.src,
          alt: data.alt ?? defaultImageValues.alt,
          fit: data.style.fit ?? defaultImageValues.fit,
        });
      }
      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent?.id, currentState, language]);

    return (
      <form>
        <Stack spacing="xs">
          <TextInput
            label="Source"
            type="url"
            size="xs"
            {...form.getInputProps("src")}
            onChange={(e) => {
              form.setFieldValue("src", e.target.value);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                src: e.target.value,
              });
            }}
          />
          <TextInput
            label="Alternative Text"
            size="xs"
            {...form.getInputProps("alt")}
            onChange={(e) => {
              form.setFieldValue("alt", e.target.value);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                alt: e.target.value,
              });
            }}
          />
          <Select
            label="Object Fit"
            size="xs"
            data={[
              { label: "Fill", value: "fill" },
              { label: "Contain", value: "contain" },
              { label: "Cover", value: "cover" },
              { label: "None", value: "none" },
              { label: "Scale down", value: "scale-down" },
            ]}
            {...form.getInputProps("fit")}
            onChange={(value) => {
              form.setFieldValue("fit", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                fit: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  }
);
