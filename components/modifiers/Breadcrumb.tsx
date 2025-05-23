import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.breadcrumb, {
        separator: selectedComponent.props?.separator,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Stack spacing="xs">
        <TextInput
          label="Separator"
          size="xs"
          {...form.getInputProps("separator")}
          onChange={(e) => {
            form.setFieldValue("separator", e.target.value);
            debouncedTreeComponentAttrsUpdate({
              attrs: { props: { separator: e.target.value } },
            });
          }}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
