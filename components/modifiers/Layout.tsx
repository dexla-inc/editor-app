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
  IconArrowsDiff,
  IconArrowsHorizontal,
  IconCircleX,
  IconFileHorizontal,
  IconLayout2,
  IconLayoutAlignBottom,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutDistributeHorizontal,
  IconLayoutDistributeVertical,
  IconLayoutList,
} from "@tabler/icons-react";
import { pick } from "next/dist/lib/pick";
import { useEffect, useState } from "react";

export const icon = IconLayout2;
export const label = "Layout";

let GROW_FLEX_DEFAULT = "1 0 auto";
let SHRINK_FLEX_DEFAULT = "0 1 auto";
let AUTO_FLEX_DEFAULT = "0 0 auto";
let CUSTOM_FLEX_DEFAULT = "1 1 auto";

export const defaultLayoutValues = {
  display: "flex",
  flexWrap: "nowrap",
  flexDirection: "column",
  rowGap: "0px",
  columnGap: "0px",
  alignItems: "stretch",
  justifyContent: "flex-start",
  position: "relative",
  flex: SHRINK_FLEX_DEFAULT,
};

export const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm({
    initialValues: defaultLayoutValues,
  });

  const [displayType, setDisplayType] = useState(
    selectedComponent?.props?.style?.display ?? defaultLayoutValues.display,
  );
  const [customFlexInputVisible, setCustomFlexInputVisible] = useState(false);

  const [grow, shrink, basis] = form.values.flex.split(" ");

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
        flex: data.style.flex ?? defaultLayoutValues.flex,
        justifyContent:
          data.style.justifyContent ?? defaultLayoutValues.justifyContent,
      });

      const isCustomFlex =
        data.style.flex !== GROW_FLEX_DEFAULT &&
        data.style.flex !== SHRINK_FLEX_DEFAULT &&
        data.style.flex !== AUTO_FLEX_DEFAULT;

      setCustomFlexInputVisible(isCustomFlex);
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
                        label="Stretch"
                        icon={<IconLayoutDistributeHorizontal size={14} />}
                      />
                    ),
                    value: "stretch",
                  },
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
                        label="Baseline"
                        icon={<IconLayoutAlignBottom size={14} />}
                      />
                    ),
                    value: "baseline",
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
                        icon={<IconLayoutList size={14} />}
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
                        label="Shrink"
                        icon={<IconArrowsDiff size={14} />}
                      />
                    ),
                    value: SHRINK_FLEX_DEFAULT,
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Grow"
                        icon={<IconArrowsHorizontal size={14} />}
                      />
                    ),
                    value: GROW_FLEX_DEFAULT,
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Auto"
                        icon={<IconCircleX size={14} />}
                      />
                    ),
                    value: AUTO_FLEX_DEFAULT,
                  },
                  {
                    label: (
                      <StylingPaneItemIcon
                        label="Custom"
                        icon={<IconFileHorizontal size={14} />}
                      />
                    ),
                    value:
                      form.values.flex === GROW_FLEX_DEFAULT ||
                      form.values.flex === SHRINK_FLEX_DEFAULT ||
                      form.values.flex === AUTO_FLEX_DEFAULT
                        ? CUSTOM_FLEX_DEFAULT
                        : form.values.flex,
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
                {...form.getInputProps("flex")}
                onChange={(value) => {
                  form.setFieldValue("flex", value as string);
                  debouncedTreeUpdate(selectedComponent?.id as string, {
                    style: { flex: value },
                  });
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
                  border: "1px solid " + theme.colors.gray[3],
                })}
              >
                <NumberInput
                  label="Grow"
                  size="xs"
                  value={parseInt(grow)}
                  onChange={(value) => {
                    const [grow, shrink, basis] = form.values.flex.split(" ");
                    const flex = `${value} ${shrink} ${basis}`;
                    form.setFieldValue("flex", flex);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { flex: flex },
                    });
                  }}
                />
                <NumberInput
                  label="Shrink"
                  size="xs"
                  value={parseInt(shrink)}
                  onChange={(value) => {
                    const [grow, shrink, basis] = form.values.flex.split(" ");
                    const flex = `${grow} ${value} ${basis}`;
                    form.setFieldValue("flex", flex);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { flex: flex },
                    });
                  }}
                />
                <UnitInput
                  label="Basis"
                  onChange={(value) => {
                    const [grow, shrink, basis] = form.values.flex.split(" ");
                    const flex = `${grow} ${shrink} ${value}`;
                    form.setFieldValue("flex", flex);
                    debouncedTreeUpdate(selectedComponent?.id as string, {
                      style: { flex: flex },
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
