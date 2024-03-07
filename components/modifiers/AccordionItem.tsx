import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconLayoutBottombarCollapse } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayoutBottombarCollapse;
export const label = "Accordion Item";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.accordionItem, {
        value: selectedComponent.props?.value,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Value"
          size="xs"
          {...form.getInputProps("value")}
          onChange={(e) => {
            form.setFieldValue("value", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { value: e.target.value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
