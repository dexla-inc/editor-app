import { debouncedTreeUpdate } from "@/utils/editor";
import { Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPhoto } from "@tabler/icons-react";
import { withModifier } from "@/hoc/withModifier";
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
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultImageValues, {
        src: selectedComponent?.props?.src,
        alt: selectedComponent?.props?.alt,
        fit: selectedComponent?.props?.style?.fit,
      }),
    });

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
              debouncedTreeUpdate(selectedComponentIds, {
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
              debouncedTreeUpdate(selectedComponentIds, {
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
              debouncedTreeUpdate(selectedComponentIds, {
                fit: value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
