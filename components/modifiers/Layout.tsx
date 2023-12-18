import { SizeSelector } from "@/components/SizeSelector";
import { TopLabel } from "@/components/TopLabel";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { debouncedTreeUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowNarrowDown,
  IconArrowNarrowRight,
  IconArrowsDiff,
  IconArrowsHorizontal,
  IconLayout2,
  IconLayoutAlignBottom,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
  IconLayoutDistributeHorizontal,
  IconLayoutDistributeVertical,
  IconLayoutList,
  IconRotate2,
  IconTextWrap,
  IconX,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export const icon = IconLayout2;
export const label = "Layout";

export let GROW_FLEX_DEFAULT = "1 0 auto";
export let SHRINK_FLEX_DEFAULT = "0 1 auto";

export const defaultLayoutValues = requiredModifiers.layout;

export const Modifier = withModifier(
  ({ selectedComponent, selectedComponentIds }) => {
    const form = useForm();

    useEffect(() => {
      form.setValues(
        merge({}, defaultLayoutValues, {
          gap: selectedComponent.props?.gap ?? "xs",
          flex: SHRINK_FLEX_DEFAULT,
          display: selectedComponent.props?.style?.display,
          position: selectedComponent.props?.style?.position,
          flexWrap: selectedComponent.props?.style?.flexWrap,
          flexDirection: selectedComponent.props?.style?.flexDirection,
          alignItems: selectedComponent.props?.style?.alignItems,
          justifyContent: selectedComponent.props?.style?.justifyContent,
        }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedComponent]);

    return (
      <form key={selectedComponent?.id}>
        <Stack spacing="xs">
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
                  value: "row",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Vertical"
                      icon={<IconArrowNarrowDown size={14} />}
                    />
                  ),
                  value: "column",
                },
              ]}
              {...form.getInputProps("flexDirection")}
              onChange={(value) => {
                form.setFieldValue("flexDirection", value as string);
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { flexDirection: value },
                });
              }}
            />
          </Stack>
          <SizeSelector
            label="Gap"
            {...form.getInputProps("gap")}
            onChange={(value) => {
              form.setFieldValue("gap", value as string);
              debouncedTreeUpdate(selectedComponentIds, {
                gap: value,
              });
            }}
          />
          <Stack spacing={2}>
            <TopLabel text="Alignment" />
            {selectedComponent.props?.style?.flexDirection === "column" ? (
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
                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { alignItems: value },
                  });
                }}
              />
            ) : (
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
                  debouncedTreeUpdate(selectedComponentIds, {
                    style: { justifyContent: value },
                  });
                }}
              />
            )}
          </Stack>
          <Stack spacing={2}>
            <TopLabel text="Scale" />
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
                debouncedTreeUpdate(selectedComponentIds, {
                  style: { flex: value },
                });
              }}
            />
          </Stack>
          <Stack spacing={2}>
            <TopLabel text="Wrap" />
            <SegmentedControl
              size="xs"
              data={[
                {
                  label: (
                    <StylingPaneItemIcon
                      label="No Wrap"
                      icon={<IconX size={14} />}
                    />
                  ),
                  value: "nowrap",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Wrap"
                      icon={<IconTextWrap size={14} />}
                    />
                  ),
                  value: "wrap",
                },
                {
                  label: (
                    <StylingPaneItemIcon
                      label="Reverse Wrap"
                      icon={<IconRotate2 size={14} />}
                    />
                  ),
                  value: "wrap-reverse",
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
              {...form.getInputProps("flexWrap")}
              onChange={(value) => {
                form.setFieldValue("flexWrap", value as string);
                debouncedTreeUpdate(selectedComponent?.id as string, {
                  style: { flexWrap: value },
                });
              }}
            />
          </Stack>
        </Stack>
      </form>
    );
  },
);
