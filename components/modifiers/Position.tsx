import { UnitInput } from "@/components/UnitInput";
import { debouncedTreeUpdate } from "@/utils/editor";
import {
  Flex,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlignBoxBottomCenter,
  IconAlignBoxCenterMiddle,
  IconAlignBoxLeftMiddle,
  IconAlignBoxRightMiddle,
  IconLayout,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { withModifier } from "@/hoc/withModifier";
import { pick } from "next/dist/lib/pick";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";

export const icon = IconLayout;
export const label = "Position";

export const defaultPositionValues = {
  position: "relative",
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto",
  zIndex: 0,
  alignSelf: "center",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultPositionValues,
  });

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["style"]);

      if (data.style) {
        form.setValues({
          position: data.style.position ?? defaultPositionValues.position,
          top: data.style.top ?? defaultPositionValues.top,
          right: data.style.right ?? defaultPositionValues.right,
          bottom: data.style.bottom ?? defaultPositionValues.bottom,
          left: data.style.left ?? defaultPositionValues.left,
          zIndex: data.style.zIndex ?? defaultPositionValues.zIndex,
          alignSelf: data.style.alignSelf ?? defaultPositionValues.alignSelf,
        });
      }
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <Stack spacing={2}>
          <Select
            label="Position"
            size="xs"
            data={[
              { label: "Relative", value: "relative" },
              { label: "Absolute", value: "absolute" },
              { label: "Sticky", value: "sticky" },
              { label: "Fixed", value: "fixed" },
            ]}
            {...form.getInputProps("position")}
            onChange={(value) => {
              form.setFieldValue("position", value as string);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { position: value },
              });
            }}
          />
          {["absolute", "sticky", "fixed"].includes(form.values.position) && (
            <>
              <Flex gap="sm">
                <UnitInput
                  label="Top"
                  {...form.getInputProps("top")}
                  onChange={(value) => {
                    form.setFieldValue("top", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { top: value },
                    });
                  }}
                />
                <UnitInput
                  label="Right"
                  {...form.getInputProps("right")}
                  onChange={(value) => {
                    form.setFieldValue("right", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { right: value },
                    });
                  }}
                />
              </Flex>
              <Flex gap="sm">
                <UnitInput
                  label="Bottom"
                  {...form.getInputProps("bottom")}
                  onChange={(value) => {
                    form.setFieldValue("bottom", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { bottom: value },
                    });
                  }}
                />
                <UnitInput
                  label="Left"
                  {...form.getInputProps("left")}
                  onChange={(value) => {
                    form.setFieldValue("left", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { left: value },
                    });
                  }}
                />
              </Flex>
            </>
          )}
        </Stack>
        <Stack spacing={2}>
          <NumberInput
            label="Z-Index"
            size="xs"
            {...form.getInputProps("zIndex")}
            onChange={(value) => {
              form.setFieldValue("zIndex", value as number);
              debouncedTreeUpdate(selectedComponent?.id as string, {
                style: { zIndex: value },
              });
            }}
          />
        </Stack>
        {["relative"].includes(form.values.position) && (
          <Stack spacing={2}>
            <Text size="xs" fw={500}>
              Align Self
            </Text>
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Start"
                      icon={<IconAlignBoxLeftMiddle size={14} />}
                    />
                  ),
                  value: "start",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Center"
                      icon={<IconAlignBoxCenterMiddle size={14} />}
                    />
                  ),
                  value: "center",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="End"
                      icon={<IconAlignBoxRightMiddle size={14} />}
                    />
                  ),
                  value: "end",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Stretch"
                      icon={<IconAlignBoxBottomCenter size={14} />}
                    />
                  ),
                  value: "stretch",
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
              {...form.getInputProps("alignSelf")}
              onChange={(value) => {
                form.setFieldValue("alignSelf", value as string);
                debouncedTreeUpdate(selectedComponent?.id as string, {
                  style: { alignSelf: value },
                });
              }}
            />
          </Stack>
        )}
      </Stack>
    </form>
  );
});
