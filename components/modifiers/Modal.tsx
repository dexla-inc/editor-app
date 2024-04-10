import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import React, { useEffect } from "react";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { useThemeStore } from "@/stores/theme";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.modal, {
        size: selectedComponent?.props?.size,
        title: selectedComponent?.props?.title,
        titleTag: selectedComponent?.props?.titleTag,
        withCloseButton: selectedComponent?.props?.withCloseButton,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Title"
          size="xs"
          {...form.getInputProps("title")}
          onChange={(e) => {
            const value = e.target.value;
            form.setFieldValue("title", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { title: value } },
            });
          }}
        />
        <SegmentedControlInput
          label="Heading Tag"
          data={[
            { label: "H1", value: "H1" },
            { label: "H2", value: "H2" },
            { label: "H3", value: "H3" },
            { label: "H4", value: "H4" },
            { label: "H5", value: "H5" },
            { label: "H6", value: "H6" },
          ]}
          {...form.getInputProps("titleTag")}
          onChange={(value) => {
            form.setFieldValue("titleTag", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  titleTag: value,
                },
              },
            });
          }}
        />
        <SizeSelector
          label="Size"
          showFullscreen
          {...form.getInputProps("size")}
          onChange={(value) => {
            form.setFieldValue("size", value as string);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { size: value } },
            });
          }}
        />
        <SegmentedControlYesNo
          label="Include Header"
          {...form.getInputProps("withCloseButton")}
          onChange={(value) => {
            form.setFieldValue("withCloseButton", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: {
                props: {
                  withCloseButton: value,
                  // Only want to do this if false
                  ...(value === false && { title: " " }),
                },
              },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
