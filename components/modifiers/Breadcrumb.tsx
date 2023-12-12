import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSlash } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconSlash;
export const label = "Breadcrumb";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
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
              debouncedTreeUpdate(selectedComponentIds, {
                separator: e.target.value,
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
