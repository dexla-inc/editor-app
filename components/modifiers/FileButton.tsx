import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, MultiSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.fileButton, {
        accept: selectedComponent.props?.accept,
        multiple: selectedComponent.props?.multiple,
        required: selectedComponent.props?.required,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <MultiSelect
          size="xs"
          label="Allowed File Type(s)"
          placeholder="*/*, image/*, .pdf"
          name="accept"
          creatable
          clearable
          data={[
            { label: "All Files", value: "*/*" },
            { label: "All Image", value: "image/*" },
            { label: "PDF", value: "application/pdf" },
            {
              label: "Word Document",
              value:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
            {
              label: "XLSX Excel Worksheet",
              value:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            { label: "XLS Excel Worksheet", value: "application/vnd.ms-excel" },
            {
              label: "PowerPoint Presentation",
              value:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            },
            { label: "Text File", value: "text/plain" },
            { label: "CSV File", value: "text/csv" },
            { label: "JPEG Image", value: "image/jpeg" },
            { label: "PNG Image", value: "image/png" },
            { label: "GIF Image", value: "image/gif" },
            { label: "MP4 Video", value: "video/mp4" },
            { label: "MP3 Audio", value: "audio/mpeg" },
            { label: "JavaScript File", value: "application/javascript" },
            { label: "HTML File", value: "text/html" },
          ]}
          {...form.getInputProps("accept")}
          onChange={(value) => {
            form.setFieldValue("accept", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { accept: value } },
            });
          }}
        />
        <SegmentedControlYesNo
          size="xs"
          checked={form.values.required}
          {...form.getInputProps("required")}
          label="Required"
          onChange={(value) => {
            form.setFieldValue("required", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { required: value } },
            });
          }}
        />
        <SegmentedControlYesNo
          size="xs"
          checked={form.values.multiple}
          {...form.getInputProps("multiple")}
          label="Allow multiple file upload"
          onChange={(value) => {
            form.setFieldValue("multiple", value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { multiple: value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
