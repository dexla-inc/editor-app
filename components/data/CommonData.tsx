import { VisibilityModifier } from "@/components/data/VisibilityModifier";
import { DataProps } from "@/types/dataBinding";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import merge from "lodash.merge";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";

export const CommonData = ({ component }: Pick<DataProps, "component">) => {
  const onLoadValues = merge(
    { currentState: { static: "default", dataType: "static" } },
    { isVisible: { static: true, dataType: "static" } },
    {
      tooltip: { static: component?.props?.tooltip ?? "", dataType: "static" },
    },
    component?.onLoad,
  );

  const form = useForm({
    initialValues: {
      onLoad: onLoadValues,
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
      <ComponentToBindFromInput<"Select">
        size="xs"
        label="State"
        {...form.getInputProps(`onLoad.currentState`)}
        data={getComponentsStates()}
        fieldType="Select"
      >
        <ComponentToBindFromInput.Select />
      </ComponentToBindFromInput>
      <ComponentToBindFromInput<"Text">
        {...form.getInputProps("onLoad.tooltip")}
        label="Tooltip"
        fieldType="Text"
      >
        <ComponentToBindFromInput.Text />
      </ComponentToBindFromInput>
    </Stack>
  );
};
