import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { useEditorStore } from "@/stores/editor";
import { structureMapper } from "@/utils/componentMapper";
import {
  Component,
  debouncedTreeComponentAttrsUpdate,
  getComponentTreeById,
} from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Select, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowAutofitContent,
  IconArrowNarrowDown,
  IconArrowNarrowRight,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

export const icon = IconArrowAutofitContent;
export const label = "Stepper";

const defaultStepperValues = requiredModifiers.stepper;

const theme = useEditorStore.getState().theme;
const createStepper = () => (stepperId: string) => {
  return structureMapper["StepperStep"].structure({
    theme,
    stepperId,
  });
};

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const editorTree = useEditorStore((state) => state.tree);
    const form = useForm();
    const selectedComponentTree = getComponentTreeById(
      editorTree.root,
      selectedComponentIds.at(-1)!,
    );

    useEffect(() => {
      form.setValues(
        merge({}, defaultStepperValues, {
          activeStep: String(selectedComponent.props?.activeStep),
          numberOfSteps: selectedComponentTree?.children?.length,
          orientation: selectedComponent.props?.orientation,
          color: selectedComponent.props?.color,
        }),
      );

      // Disabling the lint here because we don't want this to be updated every time the form changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    const addStepperStep = (stepper: Component, length: number) => {
      // TODO: get this back
      // const newStepperStep = createStepper()(selectedComponentIds[0]);
      // const newStepperSteps = Array.from({ length }, (_, i) => i + 1).map(
      //   (_, i) => newStepperStep,
      // );
      // const updatedChildren = [
      //   ...Array.from(stepper?.children ?? []),
      //   ...newStepperSteps,
      // ];
      // debouncedTreeComponentChildrenUpdate(updatedChildren!);
    };

    const removeStepperStep = (stepper: Component, newSize: string) => {
      // TODO: get this back
      // const updatedChildren = stepper?.children?.slice(0, Number(newSize));
      // debouncedTreeComponentChildrenUpdate(updatedChildren!);
      //
      // if (form.values.activeStep === newSize) {
      //   const newActiveStep = String(Number(newSize) - 1);
      //   form.setFieldValue("activeStep", newActiveStep);
      //   debouncedTreeUpdate(selectedComponentIds, {
      //     activeStep: newActiveStep,
      //   });
      // }
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
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { activeStep: value } },
              });
            }}
          />
          <UnitInput
            label="Number of Steps"
            {...form.getInputProps("numberOfSteps")}
            onChange={(value) => {
              // TODO: get this back
              // const stepper = getComponentById(
              //   editorTree.root,
              //   selectedComponent?.id!,
              // );
              // if (Number(value) > Number(form.values.numberOfSteps)) {
              //   const length =
              //     Number(value) - Number(form.values.numberOfSteps);
              //   addStepperStep(stepper!, length);
              // } else {
              //   removeStepperStep(stepper!, value);
              // }
              // form.setFieldValue("numberOfSteps", Number(value));
            }}
          />
          <Stack spacing={2}>
            <TopLabel text="Direction" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Horizontal"
                      icon={<IconArrowNarrowRight size={14} />}
                    />
                  ),
                  value: "horizontal",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Vertical"
                      icon={<IconArrowNarrowDown size={14} />}
                    />
                  ),
                  value: "vertical",
                },
              ]}
              {...form.getInputProps("orientation")}
              onChange={(value) => {
                form.setFieldValue("orientation", value as string);
                debouncedTreeComponentAttrsUpdate({
                  attrs: { props: { orientation: value } },
                });
              }}
            />
            {form.values?.orientation === "vertical" && (
              <ThemeColorSelector
                label="Color"
                {...form.getInputProps("color")}
                onChange={(value: string) => {
                  form.setFieldValue("color", value);
                  debouncedTreeComponentAttrsUpdate({
                    attrs: { props: { color: value } },
                  });
                }}
              />
            )}
          </Stack>
        </Stack>
      </form>
    );
  },
);
