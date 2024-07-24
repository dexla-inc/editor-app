import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { usePageList } from "@/hooks/editor/usePageList";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type Props = {
  form: UseFormReturnType<
    Record<string, unknown>,
    (values: Record<string, unknown>) => Record<string, unknown>
  >;
};

export const UrlOrPageSelector = ({ form }: Props) => {
  const pages = usePageList();

  const setFieldValue = (value: string) => {
    form.setFieldValue("customLinkUrl", value);
    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { customLinkUrl: value } },
    });
  };

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
          const values = { customLinkType: value, customLinkUrl: "" };
          form.setValues(values);
          debouncedTreeComponentAttrsUpdate({
            attrs: {
              props: values,
            },
          });
        }}
      />
      {form.values.customLinkType === "url" ? (
        <TextInput
          label="Custom Url Link"
          placeholder="Enter the URL"
          type="url"
          size="xs"
          {...form.getInputProps("customLinkUrl")}
          onChange={(e) => setFieldValue(e.target.value)}
        />
      ) : (
        <Select
          label="Custom Page Link"
          placeholder="Select Page"
          size="xs"
          {...form.getInputProps("customLinkUrl")}
          onChange={setFieldValue}
          data={pages}
        />
      )}
    </>
  );
};
