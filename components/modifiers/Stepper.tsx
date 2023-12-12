import { UnitInput } from "@/components/UnitInput";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import {
  Component,
  debouncedTreeComponentChildrenUpdate,
  debouncedTreeUpdate,
  getComponentById,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowAutofitContent } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";

export const icon = IconArrowAutofitContent;
export const label = "Stepper";

const defaultStepperValues = requiredModifiers.stepper;

const editorStore = useEditorStore.getState();
const createStepper = () => (stepperId: string) => {
  return structureMapper["StepperStep"].structure({
    theme: editorStore.theme,
    stepperId,
  });
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const editorTree = useEditorStore((state) => state.tree);
  const form = useForm({
    initialValues: defaultStepperValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["activeStep"]);

      form.setValues({
        activeStep: String(data.activeStep) ?? defaultStepperValues.activeStep,
        numberOfSteps:
          selectedComponent.children?.length ??
          defaultStepperValues.numberOfSteps,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addStepperStep = (stepper: Component) => {
    const newStepperStep = createStepper()(selectedComponent?.id!);
    const updatedChildren = [
      ...Array.from(stepper?.children ?? []),
      newStepperStep,
    ];
    debouncedTreeComponentChildrenUpdate(updatedChildren);
  };

  const removeStepperStep = (stepper: Component, newSize: string) => {
    const updatedChildren = stepper?.children?.slice(0, Number(newSize));
    debouncedTreeComponentChildrenUpdate(updatedChildren!);

    if (form.values.activeStep === newSize) {
      const newActiveStep = String(Number(newSize) - 1);
      form.setFieldValue("activeStep", newActiveStep);
      debouncedTreeUpdate(selectedComponent?.id as string, {
        activeStep: newActiveStep,
      });
    }
  };

  return (
    <form>
      <Stack spacing="xs">
        <Select
          label="Active Step"
          size="xs"
          data={Array(form.values.numberOfSteps)
            .fill(null)
            .map((_, i) => ({
              label: `Step ${i + 1}`,
              value: String(i),
            }))}
          {...form.getInputProps("activeStep")}
          onChange={(value) => {
            form.setFieldValue("activeStep", String(value));
            debouncedTreeUpdate(selectedComponent?.id as string, {
              activeStep: value,
            });
          }}
        />
        <UnitInput
          label="Number of Steps"
          {...form.getInputProps("numberOfSteps")}
          onChange={(value) => {
            const stepper = getComponentById(
              editorTree.root,
              selectedComponent?.id!,
            );
            if (Number(value) > Number(form.values.numberOfSteps)) {
              addStepperStep(stepper!);
            } else {
              removeStepperStep(stepper!, value);
            }
            form.setFieldValue("numberOfSteps", Number(value));
          }}
        />
      </Stack>
    </form>
  );
});
