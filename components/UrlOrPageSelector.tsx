import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { useEditorStore } from "@/stores/editor";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ChangeEvent } from "react";

type Props = {
  form: UseFormReturnType<
    Record<string, unknown>,
    (values: Record<string, unknown>) => Record<string, unknown>
  >;
};

export const UrlOrPageSelector = ({ form }: Props) => {
  const pages = useEditorStore((state) => state.pages);

  const setFieldValue = (
    value: ChangeEvent<HTMLInputElement> | string | null,
  ) => {
    const _value =
      value && typeof value === "object" ? value.target.value : value;
    form.setFieldValue("customLinkUrl", _value);
    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { customLinkUrl: _value } },
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
          onChange={setFieldValue}
        />
      ) : (
        <Select
          label="Custom Page Link"
          placeholder="Select Page"
          size="xs"
          {...form.getInputProps("customLinkUrl")}
          onChange={setFieldValue}
          data={pages.map((page) => ({
            label: page.title,
            value: page.id,
          }))}
        />
      )}
    </>
  );
};
