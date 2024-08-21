import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import {
  Flex,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconAlignBoxBottomCenter,
  IconAlignBoxCenterMiddle,
  IconAlignBoxLeftMiddle,
  IconAlignBoxRightMiddle,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();
  useEffect(() => {
    form.setValues(
      merge({}, requiredModifiers.position, {
        position: selectedComponent?.props?.style?.position,
        top: selectedComponent?.props?.style?.top,
        right: selectedComponent?.props?.style?.right,
        bottom: selectedComponent?.props?.style?.bottom,
        left: selectedComponent?.props?.style?.left,
        zIndex: selectedComponent?.props?.style?.zIndex,
        alignSelf: selectedComponent?.props?.style?.alignSelf,
      }),
    );
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
              debouncedTreeComponentAttrsUpdate({
                attrs: {
                  props: {
                    style: { position: value },
                  },
                },
              });
            }}
          />
          {["absolute", "sticky", "fixed"]?.includes(
            form.values.position as string,
          ) && (
            <>
              <Flex gap="sm">
                <UnitInput
                  label="Top"
                  {...form.getInputProps("top")}
                  onChange={(value) => {
                    form.setFieldValue("top", value as string);
                    debouncedTreeComponentAttrsUpdate({
                      attrs: {
                        props: {
                          style: { top: value },
                        },
                      },
                    });
                  }}
                />
                <UnitInput
                  label="Right"
                  {...form.getInputProps("right")}
                  onChange={(value) => {
                    form.setFieldValue("right", value as string);
                    debouncedTreeComponentAttrsUpdate({
                      attrs: { props: { style: { right: value } } },
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
                    debouncedTreeComponentAttrsUpdate({
                      attrs: { props: { style: { bottom: value } } },
                    });
                  }}
                />
                <UnitInput
                  label="Left"
                  {...form.getInputProps("left")}
                  onChange={(value) => {
                    form.setFieldValue("left", value as string);
                    debouncedTreeComponentAttrsUpdate({
                      attrs: { props: { style: { left: value } } },
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
              debouncedTreeComponentAttrsUpdate({
                attrs: { props: { style: { zIndex: value } } },
              });
            }}
          />
        </Stack>
        {["relative"].includes(form.values.position as string) && (
          <Stack spacing={2}>
            <TopLabel text="Align Self" />
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
                debouncedTreeComponentAttrsUpdate({
                  attrs: { props: { style: { alignSelf: value } } },
                });
              }}
            />
          </Stack>
        )}
      </Stack>
    </form>
  );
});

export default Modifier;
