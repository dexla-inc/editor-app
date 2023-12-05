import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSlash } from "@tabler/icons-react";
import merge from "lodash.merge";

export const icon = IconSlash;
export const label = "Breadcrumb";

export const defaultBreadcrumbsValues = {
  separator: "/",
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm({
      initialValues: merge({}, defaultBreadcrumbsValues, {
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
