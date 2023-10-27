import { UnitInput } from "@/components/UnitInput";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import {
  debouncedTreeComponentStyleUpdate,
  debouncedTreeUpdate,
} from "@/utils/editor";
import {
  Group,
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
  IconCircleX,
  IconLayout2,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutDistributeHorizontal,
  IconLayoutDistributeVertical,
  IconLayoutKanban,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect, useState } from "react";

export const icon = IconLayout2;
export const label = "Layout";

export const defaultLayoutValues = {
  display: "flex",
  flexWrap: "nowrap",
  flexDirection: "column",
  rowGap: "20px",
  columnGap: "20px",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  sizing: "0 0 auto",
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultLayoutValues,
  });

  const [displayType, setDisplayType] = useState(
    selectedComponent?.props?.style?.display ?? defaultLayoutValues.display,
  );
  const [customFlexInputVisible, setCustomFlexInputVisible] = useState(() => {
    const initialSizing = selectedComponent?.props?.style?.sizing;
    return (
      initialSizing !== "1 0 auto" &&
      initialSizing !== "0 1 auto" &&
      initialSizing !== "0 0 auto"
    );
  });

  useEffect(() => {
    console.log(customFlexInputVisible);
  }, [customFlexInputVisible]);

  const [grow, shrink, basis] = form.values.sizing.split(" ");

  useEffect(() => {
    if (selectedComponent?.id) {
      const data = pick(selectedComponent.props!, ["style"]);

      form.setValues({
        display: data.style?.display ?? defaultLayoutValues.display,
        position: data.style.position ?? defaultLayoutValues.position,
        flexWrap: data.style.flexWrap ?? defaultLayoutValues.flexWrap,
        flexDirection:
          data.style.flexDirection ?? defaultLayoutValues.flexDirection,
        rowGap: data.style.rowGap ?? defaultLayoutValues.rowGap,
        columnGap: data.style.columnGap ?? defaultLayoutValues.columnGap,
        alignItems: data.style.alignItems ?? defaultLayoutValues.alignItems,
        sizing: data.style.flex ?? defaultLayoutValues.sizing,
        justifyContent:
          data.style.justifyContent ?? defaultLayoutValues.justifyContent,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form key={selectedComponent?.id}>
      <Stack spacing="xs">
        <Select
          label="Display"
          size="xs"
          data={[
            { label: "flex", value: "flex" },
            { label: "none", value: "none" },
            // { label: "inline", value: "inline" },
            // { label: "block", value: "block" },
            // { label: "inherit", value: "inherit" },
          ]}
          {...form.getInputProps("display")}
          onChange={(value) => {
            form.setFieldValue("display", value as string);
            debouncedTreeComponentStyleUpdate("display", value as string);
            setDisplayType(value as string);
          }}
        />
        {displayType === "flex" && (
          // When adding new displays such as inline, block, grid etc, these Flex components should be moved into a LayoutFlex component
          <>
            <Stack spacing={2}>
              <Text size="xs" fw={500}>
                Direction
              </Text>
              <SegmentedControl
                size="xs"
                data={[
                  { label: "Horizontal", value: "row" },
                  { label: "Vertical", value: "column" },
                ]}
                {...form.getInputProps("flexDirection")}
                onChange={(value) => {
                  form.setFieldValue("flexDirection", value as string);
                  debouncedTreeUpdate(selectedComponent?.id as string, {
                    style: { flexDirection: value },
                  });
                }}
              />
            </Stack>
            <Stack spacing={2}>
              <Group noWrap>
                <UnitInput
                  label="Row Gap"
                  {...form.getInputProps("rowGap")}
                  onChange={(value) => {
                    form.setFieldValue("rowGap", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { rowGap: value },
                    });
                  }}
                />
                <UnitInput
                  label="Column Gap"
                  {...form.getInputProps("columnGap")}
                  onChange={(value) => {
                    form.setFieldValue("columnGap", value as string);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { columnGap: value },
                    });
                  }}
                />
              </Group>
            </Stack>
            <Stack spacing={2}>
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
                        icon={<IconAlignBoxLeftMiddle size={14} />}
                      />
                    ),
                    value: "flex-start",
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
                    value: "flex-end",
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
                {...form.getInputProps("alignItems")}
                onChange={(value) => {
                  form.setFieldValue("alignItems", value as string);
                  debouncedTreeUpdate(selectedComponent?.id as string, {
                    style: { alignItems: value },
                  });
                }}
              />
            </Stack>
            <Stack spacing={2}>
              <Text size="xs" fw={500}>
                Justify
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
                    value: "flex-start",
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
                    value: "flex-end",
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Space Between"
                        icon={<IconLayoutDistributeHorizontal size={14} />}
                      />
                    ),
                    value: "space-between",
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Space Around"
                        icon={<IconLayoutDistributeVertical size={14} />}
                      />
                    ),
                    value: "space-around",
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
                {...form.getInputProps("justifyContent")}
                onChange={(value) => {
                  form.setFieldValue("justifyContent", value as string);
                  debouncedTreeUpdate(selectedComponent?.id as string, {
                    style: { justifyContent: value },
                  });
                }}
              />
            </Stack>
            <Stack spacing={2}>
              <Text size="xs" fw={500}>
                Sizing
              </Text>
              <SegmentedControl
                size="xs"
                data={[
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Grow"
                        icon={<IconLayoutSidebarLeftExpand size={14} />}
                      />
                    ),
                    value: "1 0 auto",
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Shrink"
                        icon={<IconLayoutSidebarLeftCollapse size={14} />}
                      />
                    ),
                    value: "0 1 auto",
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Auto"
                        icon={<IconCircleX size={14} />}
                      />
                    ),
                    value: "0 0 auto",
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Auto"
                        icon={<IconLayoutKanban size={14} />}
                      />
                    ),
                    value: "1 1 auto",
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
                {...form.getInputProps("sizing")}
                onChange={(value) => {
                  form.setFieldValue("sizing", value as string);
                  debouncedTreeUpdate(selectedComponent?.id as string, {
                    style: { flex: value },
                  });
                  if (value === "1 1 auto") {
                    setCustomFlexInputVisible(true);
                  } else {
                    setCustomFlexInputVisible(false);
                  }
                }}
              />
            </Stack>
            {customFlexInputVisible && (
              <Stack
                spacing={2}
                p="xs"
                bg="gray.1"
                sx={(theme) => ({
                  borderRadius: theme.radius.sm,
                  border: "1px solid " + theme.colors.gray[2],
                })}
              >
                <NumberInput
                  label="Grow"
                  size="xs"
                  value={parseInt(grow)}
                  onChange={(value) => {
                    const [grow, shrink, basis] = form.values.sizing.split(" ");
                    const sizing = `${value} ${shrink} ${basis}`;
                    form.setFieldValue("sizing", sizing);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { flex: sizing },
                    });
                  }}
                />
                <NumberInput
                  label="Shrink"
                  size="xs"
                  value={parseInt(shrink)}
                  onChange={(value) => {
                    const [grow, shrink, basis] = form.values.sizing.split(" ");
                    const sizing = `${grow} ${value} ${basis}`;
                    form.setFieldValue("sizing", sizing);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { flex: sizing },
                    });
                  }}
                />
                <UnitInput
                  label="Basis"
                  onChange={(value) => {
                    const [grow, shrink, basis] = form.values.sizing.split(" ");
                    const sizing = `${grow} ${shrink} ${value}`;
                    form.setFieldValue("sizing", sizing);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { flex: sizing },
                    });
                  }}
                />
              </Stack>
            )}

            <Select
              label="Wrap"
              size="xs"
              data={[
                { label: "Wrap", value: "wrap" },
                { label: "Wrap Reverse", value: "wrap-reverse" },
                { label: "No Wrap", value: "nowrap" },
              ]}
              {...form.getInputProps("flexWrap")}
              onChange={(value) => {
                form.setFieldValue("flexWrap", value as string);
                debouncedTreeUpdate(selectedComponent?.id as string, {
                  style: { flexWrap: value },
                });
              }}
            />
          </>
        )}
      </Stack>
    </form>
  );
});
