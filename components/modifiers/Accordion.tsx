import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentPropsUpdate } from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutBottombarCollapse } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { IconSelector } from "../IconSelector";

const defaultInputValues = { variant: "default", icon: "" };

export const icon = IconLayoutBottombarCollapse;
export const label = "Accordion";

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultInputValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["variant", "icon"]);
      form.setValues({
        variant: data.variant ?? defaultInputValues.variant,
        icon: data.icon ?? defaultInputValues.icon,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const data: Record<string, string> = {
    Default: "default",
    Contained: "contained",
    Filled: "filled",
    Separated: "separated",
  };

  return (
    <form>
      <Stack spacing="xs">
        <Select
          label="Value"
          size="xs"
          data={Object.keys(data).map((key) => ({
            label: key,
            value: data[key],
          }))}
          {...form.getInputProps("variant")}
          onChange={(value) => {
            form.setFieldValue("variant", value as string);
            debouncedTreeComponentPropsUpdate("variant", value);
          }}
        />
        <IconSelector
          topLabel="Icon"
          selectedIcon={form.values.icon}
          onIconSelect={(value: string) => {
            form.setFieldValue("icon", value);
            debouncedTreeComponentPropsUpdate("icon", value);
          }}
        />
      </Stack>
    </form>
  );
});
