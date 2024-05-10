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
            { label: "Image", value: "image/*" },
            { label: "PDF", value: ".pdf" },
            { label: "Word Document", value: ".docx" },
            { label: "Excel Spreadsheet", value: ".xlsx" },
            { label: "PowerPoint Presentation", value: ".pptx" },
            { label: "Text File", value: ".txt" },
            { label: "CSV File", value: ".csv" },
            { label: "JPEG Image", value: ".jpeg" },
            { label: "PNG Image", value: ".png" },
            { label: "GIF Image", value: ".gif" },
            { label: "MP4 Video", value: ".mp4" },
            { label: "MP3 Audio", value: ".mp3" },
            { label: "JavaScript File", value: ".js" },
            { label: "HTML File", value: ".html" },
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
