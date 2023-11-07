import { withModifier } from "@/hoc/withModifier";
import {
  Component,
  debouncedTreeComponentChildrenUpdate,
  debouncedTreeComponentPropsUpdate,
  debouncedTreeUpdate,
  getComponentById,
} from "@/utils/editor";
import { SegmentedControl, Select, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCarouselHorizontal,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
} from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect } from "react";
import { UnitInput } from "@/components/UnitInput";
import { structureMapper } from "@/utils/componentMapper";
import { useEditorStore } from "@/stores/editor";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { SizeSelector } from "@/components/SizeSelector";

export const icon = IconCarouselHorizontal;
export const label = "Carousel";

export const defaultCarouselValues = {
  initialSlide: "0",
  numberOfSlides: 3,
  controlsOffset: "sm",
  controlSize: "26px",
  orientation: "horizontal",
  align: "center",
};

const editorStore = useEditorStore.getState();
const createSlide = () => () => {
  return structureMapper["Image"].structure({
    theme: editorStore.theme,
    props: {
      style: {
        height: "200px",
        width: "100%,",
      },
    },
  });
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const editorTree = useEditorStore((state) => state.tree);
  const form = useForm({
    initialValues: defaultCarouselValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, [
        "initialSlide",
        "align",
        "controlSize",
        "controlsOffset",
        "orientation",
      ]);

      form.setValues({
        initialSlide:
          String(data.initialSlide) ?? defaultCarouselValues.initialSlide,
        numberOfSlides:
          selectedComponent.children?.length ??
          defaultCarouselValues.numberOfSlides,
        align: data.align ?? defaultCarouselValues.align,
        controlSize: data.controlSize ?? defaultCarouselValues.controlSize,
        orientation: data.orientation ?? defaultCarouselValues.orientation,
        controlsOffset:
          data.controlsOffset ?? defaultCarouselValues.controlsOffset,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  const addCarouselSlide = (stepper: Component) => {
    const newCarouselSlide = createSlide()();
    const updatedChildren = [
      ...Array.from(stepper?.children ?? []),
      newCarouselSlide,
    ];
    debouncedTreeComponentChildrenUpdate(updatedChildren);
  };

  const removeCarouselSlide = (carousel: Component, newSize: string) => {
    const updatedChildren = carousel?.children?.slice(0, Number(newSize));
    debouncedTreeComponentChildrenUpdate(updatedChildren!);

    if (form.values.initialSlide === newSize) {
      const newInitialSlide = String(Number(newSize) - 1);
      form.setFieldValue("initialSlide", newInitialSlide);
      debouncedTreeUpdate(selectedComponent?.id as string, {
        initialSlide: newInitialSlide,
      });
    }
  };

  return (
    <form>
      <Stack spacing="xs">
        <Text size="xs" fw={500}>
          Align
        </Text>
        <SegmentedControl
          size="xs"
          data={[
            {
              label: (
                <StylingPaneItemIcon
                  label="Start"
                  icon={<IconLayoutAlignLeft size={14} />}
                />
              ),
              value: "start",
            },
            {
              label: (
                <StylingPaneItemIcon
                  label="Center"
                  icon={<IconLayoutAlignCenter size={14} />}
                />
              ),
              value: "center",
            },
            {
              label: (
                <StylingPaneItemIcon
                  label="End"
                  icon={<IconLayoutAlignRight size={14} />}
                />
              ),
              value: "end",
            },
          ]}
          styles={{
            label: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            },
          }}
          {...form.getInputProps("align")}
          onChange={(value) => {
            form.setFieldValue("align", value as string);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              align: value,
            });
          }}
        />
      </Stack>
      <Stack spacing="xs">
        <Text size="xs" fw={500}>
          Orientation
        </Text>
        <SegmentedControl
          size="xs"
          data={[
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ]}
          {...form.getInputProps("orientation")}
          onChange={(value) => {
            form.setFieldValue("orientation", value as string);
            debouncedTreeUpdate(selectedComponent?.id as string, {
              orientation: value,
            });
          }}
        />
      </Stack>
      <UnitInput
        label="Control Size"
        disabledUnits={["%", "auto", "vh", "vw", "rem"]}
        {...form.getInputProps("controlSize")}
        onChange={(value) => {
          form.setFieldValue("controlSize", value as string);
          debouncedTreeComponentPropsUpdate("controlSize", value);
        }}
      />
      <SizeSelector
        label="Control Offset"
        {...form.getInputProps("controlsOffset")}
        onChange={(value) => {
          form.setFieldValue("controlsOffset", value as string);
          debouncedTreeComponentPropsUpdate("controlsOffset", value);
        }}
      />
      <Stack spacing="xs">
        <Select
          label="Active Slide"
          size="xs"
          data={Array(form.values.numberOfSlides)
            .fill(null)
            .map((_, i) => ({
              label: `Slide ${i + 1}`,
              value: String(i),
            }))}
          {...form.getInputProps("initialSlide")}
          onChange={(value) => {
            form.setFieldValue("initialSlide", String(value));
            debouncedTreeUpdate(selectedComponent?.id as string, {
              initialSlide: value,
            });
          }}
        />
        <UnitInput
          label="Number of Slides"
          {...form.getInputProps("numberOfSlides")}
          onChange={(value) => {
            const carousel = getComponentById(
              editorTree.root,
              selectedComponent?.id!,
            );
            if (Number(value) > Number(form.values.numberOfSlides)) {
              addCarouselSlide(carousel!);
            } else {
              removeCarouselSlide(carousel!, value);
            }
            form.setFieldValue("numberOfSlides", Number(value));
          }}
        />
      </Stack>
    </form>
  );
});
