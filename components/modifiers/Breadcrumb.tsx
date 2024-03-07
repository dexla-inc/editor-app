import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import merge from "lodash.merge";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: merge({}, requiredModifiers.breadcrumb, {
      separator: selectedComponent.props?.separator,
    }),
  });

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
