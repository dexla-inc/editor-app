import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { SizeSelector } from "@/components/SizeSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Stack, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSelect } from "@tabler/icons-react";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconSelect;
export const label = "Select";

export const defaultSelectValues = {
  name: "Select",
  size: "sm",
  placeholder: "Select",
  icon: "",
  withAsterisk: false,
  clearable: false,
  data: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
  ],
  exampleData: [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
  ],
  customText: "",
  customLinkText: "",
  customLinkUrl: "",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultSelectValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "name",
        "size",
        "placeholder",
        "icon",
        "data",
        "withAsterisk",
        "clearable",
        "customText",
        "customLinkText",
        "customLinkUrl",
      ]);

      form.setValues(merge(defaultSelectValues, data));
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeComponentPropsUpdate(key, value);
  };

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Name"
          size="xs"
          {...form.getInputProps("name")}
          onChange={(e) => {
            form.setFieldValue("name", e.target.value);
            debouncedTreeComponentPropsUpdate("name", e.target.value);
          }}
        />
        <Stack spacing={2}>
          <Text size="xs" fw={500}>
            Clearable
          </Text>
          <Switch
            {...form.getInputProps("clearable")}
            size="xs"
            onChange={(e) =>
              setFieldValue("clearable", e.currentTarget.checked)
            }
          />
        </Stack>
        <TextInput
          label="Placeholder"
          size="xs"
          {...form.getInputProps("placeholder")}
          onChange={(e) => {
            setFieldValue("placeholder", e.target.value);
          }}
        />
        <SizeSelector
          {...form.getInputProps("size")}
          onChange={(value) => {
            setFieldValue("size", value as string);
          }}
        />

        <SelectOptionsForm
          getValue={() => form.getInputProps("data").value}
          setFieldValue={setFieldValue}
        />

        <TextInput
          label="Custom Text"
          size="xs"
          {...form.getInputProps("customText")}
          onChange={(e) => {
            setFieldValue("customText", e.target.value);
          }}
        />
        <TextInput
          label="Custom Link Description"
          size="xs"
          {...form.getInputProps("customLinkText")}
          onChange={(e) => {
            setFieldValue("customLinkText", e.target.value);
          }}
        />
        <TextInput
          label="Custom Link Url"
          size="xs"
          {...form.getInputProps("customLinkUrl")}
          onChange={(e) => {
            setFieldValue("customLinkUrl", e.target.value);
          }}
        />
      </Stack>
    </form>
  );
});
