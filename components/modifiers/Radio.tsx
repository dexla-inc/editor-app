import { SwitchSelector } from "@/components/SwitchSelector";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconRadio } from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconRadio;
export const label = "Radio";

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, requiredModifiers.radio, {
          withAsterisk: selectedComponent?.props?.withAsterisk,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form>
        <Stack spacing="xs">
          <SwitchSelector
            topLabel="Required"
            {...form.getInputProps("withAsterisk")}
            onChange={(event) => {
              form.setFieldValue("withAsterisk", event.currentTarget.checked);
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { withAsterisk: event.currentTarget.checked } },
              });
            }}
          />
        </Stack>
      </form>
    );
  },
);
