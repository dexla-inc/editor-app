import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { useEditorStore } from "@/stores/editor";
import { Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<
    Record<string, unknown>,
    (values: Record<string, unknown>) => Record<string, unknown>
  >;
  onChange: (key: string, value: string | null | undefined) => void;
  onChangeMultiple: (values: Record<string, any>) => void;
};

export const UrlOrPageSelector = ({
  form,
  onChange,
  onChangeMultiple,
}: Props) => {
  const pages = useEditorStore((state) => state.pages);
  return (
    <>
      <SegmentedControlInput
        label="Custom Link Type"
        data={[
          {
            label: "Url",
            value: "url",
          },
          {
            label: "Page",
            value: "page",
          },
        ]}
        {...form.getInputProps("customLinkType")}
        onChange={(value) => {
          if (onChangeMultiple) {
            onChangeMultiple({ customLinkType: value, customLinkUrl: "" });
          }
        }}
      />
      {form.values.customLinkType === "url" ? (
        <TextInput
          label="Custom Url Link"
          size="xs"
          {...form.getInputProps("customLinkUrl")}
          onChange={(e) => {
            onChange && onChange("customLinkUrl", e.target.value);
          }}
        />
      ) : (
        <Select
          label="Custom Page Link"
          size="xs"
          {...form.getInputProps("customLinkUrl")}
          onChange={(value) => {
            onChange && onChange("customLinkUrl", value);
          }}
          data={pages.map((page) => ({
            label: page.title,
            value: page.id,
          }))}
        />
      )}
    </>
  );
};
