import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/components/data/type";
import { useComponentStates } from "@/hooks/useComponentStates";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { ComponentToBindFromSelect } from "../ComponentToBindFromSelect";

export const CommonData = ({ component }: DataProps) => {
  const form = useForm({
    initialValues: {
      onLoad: {
        currentState: component?.onLoad?.currentState || "default",
      },
    },
  });

  const { getComponentsStates } = useComponentStates();

  useEffect(() => {
    if (form.isTouched()) {
      debouncedTreeComponentAttrsUpdate({ attrs: form.values });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
    <Stack spacing="xs">
      <VisibilityModifier form={form} />
      <ComponentToBindFromSelect
        size="xs"
        label="State"
        {...form.getInputProps(`onLoad.currentState`)}
        data={getComponentsStates()}
      />
    </Stack>
  );
};
