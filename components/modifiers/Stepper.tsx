import { withModifier } from "@/hoc/withModifier";
import {
  debouncedTreeComponentChildrenUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import { Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowAutofitContent } from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";
import { structureMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";
import { add } from "husky";

export const icon = IconArrowAutofitContent;
export const label = "Stepper";

export const defaultStepperValues = {
  activeStep: "0",
  numberOfSteps: 3,
};

const editorStore = useEditorStore.getState();
const createStepper = () => {
  return structureMapper["StepperStep"].structure({
    theme: editorStore.theme,
  });
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultStepperValues,
  });

  const steppers = selectedComponent?.children?.find(
    (child) => child.name === "StepperContent",
  )?.children;

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["activeStep"]);

      form.setValues({
        activeStep: data.activeStep ?? defaultStepperValues.activeStep,
        numberOfSteps: steppers?.length ?? defaultStepperValues.numberOfSteps,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addStepperStep = () => {
    const newStepperStep = createStepper();
    const updatedChildren = [...(steppers ?? []), newStepperStep];
    debouncedTreeComponentChildrenUpdate(updatedChildren);
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
            if (Number(value) > Number(form.values.numberOfSteps)) {
              addStepperStep();
            } else {
              const updatedChildren = steppers?.slice(0, Number(value));
              debouncedTreeComponentChildrenUpdate(updatedChildren!);
            }
            form.setFieldValue("numberOfSteps", Number(value));
          }}
        />
      </Stack>
    </form>
  );
});
