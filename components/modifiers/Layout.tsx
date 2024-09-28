import { SizeSelector } from "@/components/SizeSelector";
import { TopLabel } from "@/components/TopLabel";
import { StylingPaneItemIcon } from "@/components/modifiers/StylingPaneItemIcon";
import { withModifier } from "@/hoc/withModifier";
import { gapSizes } from "@/utils/defaultSizes";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { SegmentedControl, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconArrowNarrowDown,
  IconArrowNarrowRight,
  IconArrowsDiff,
  IconArrowsHorizontal,
  IconLayoutAlignBottom,
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignMiddle,
  IconLayoutAlignRight,
  IconLayoutAlignTop,
  IconLayoutDistributeVertical,
  IconLayoutList,
  IconRotate2,
  IconTextWrap,
  IconX,
} from "@tabler/icons-react";
import merge from "lodash.merge";
import { useEffect } from "react";

export let GROW_FLEX_DEFAULT = "1 0 auto";
export let SHRINK_FLEX_DEFAULT = "0 1 auto";

const defaultLayoutValues = requiredModifiers.layout;

const justifyContentData = [
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
];
const alignItemsData = [
  {
    label: (
      <StylingPaneItemIcon
        label="Start"
        icon={<IconLayoutAlignTop size={14} />}
      />
    ),
    value: "flex-start",
  },
  {
    label: (
      <StylingPaneItemIcon
        label="Center"
        icon={<IconLayoutAlignMiddle size={14} />}
      />
    ),
    value: "center",
  },
  {
    label: (
      <StylingPaneItemIcon
        label="End"
        icon={<IconLayoutAlignBottom size={14} />}
      />
    ),
    value: "flex-end",
  },
];

const Modifier = withModifier(({ selectedComponent }) => {
  const form = useForm();

  useEffect(() => {
    form.setValues(
      merge({}, defaultLayoutValues, {
        gap: selectedComponent.props?.gap ?? "xs",
        flex: selectedComponent.props?.style?.flex,
        display: selectedComponent.props?.style?.display,
        position: selectedComponent.props?.style?.position,
        flexWrap: selectedComponent.props?.style?.flexWrap,
        flexDirection: selectedComponent.props?.style?.flexDirection,
        alignItems: selectedComponent.props?.style?.alignItems,
        justifyContent: selectedComponent.props?.style?.justifyContent,
        width: selectedComponent.props?.style?.width,
        flexBasis: selectedComponent.props?.style?.flexBasis,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  let isFlexDirectionColumn =
    selectedComponent.props?.style?.flexDirection === "column";

  const rowJustifyContentData = justifyContentData.filter((item) => {
    // Include flex-start, center, and flex-end if flexDirection is column
    if (selectedComponent.props?.style?.flexDirection === "row") {
      return ["space-between", "space-around"].includes(item.value);
    }
    // Otherwise, include all items
    return true;
  });

  const onChangeField = (field: string, value: string, isProp = false) => {
    const props = isProp ? { [field]: value } : { style: { [field]: value } };
    form.setFieldValue(field, value);
    debouncedTreeComponentAttrsUpdate({
      attrs: { props },
    });
  };

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
            onChange={(value) => onChangeField("flexDirection", value)}
          />
        </Stack>
        <SizeSelector
          label="Gap"
          sizing={gapSizes}
          showFullLabel
          {...form.getInputProps("gap")}
          onChange={(value) => onChangeField("gap", value as string, true)}
        />
        <Stack spacing={2}>
          <TopLabel
            text={
              isFlexDirectionColumn
                ? "Alignment (Horizontal)"
                : "Alignment (Vertical)"
            }
          />
          <SegmentedControl
            size="xs"
            data={alignItemsData}
            styles={{
              label: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              },
            }}
            {...form.getInputProps("alignItems")}
            onChange={(value) => onChangeField("alignItems", value)}
          />
        </Stack>
        <Stack spacing={2}>
          <TopLabel
            text={
              isFlexDirectionColumn
                ? "Alignment (Vertical)"
                : "Alignment (Horizontal)"
            }
          />
          {isFlexDirectionColumn ? (
            <SegmentedControl
              size="xs"
              data={rowJustifyContentData}
              styles={{
                label: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              }}
              {...form.getInputProps("justifyContent")}
              onChange={(value) => onChangeField("justifyContent", value)}
            />
          ) : (
            <SegmentedControl
              size="xs"
              data={justifyContentData}
              styles={{
                label: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                },
              }}
              {...form.getInputProps("justifyContent")}
              onChange={(value) => onChangeField("justifyContent", value)}
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
            onChange={(value) => onChangeField("flex", value)}
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
            onChange={(value) => onChangeField("flexWrap", value)}
          />
        </Stack>
        <Stack spacing={2}>
          <TopLabel text="Width" />
          <SegmentedControl
            size="xs"
            data={[
              { label: "Fit Content", value: "fit-content" },
              { label: "100%", value: "100%" },
            ]}
            {...form.getInputProps("width")}
            onChange={(value) => onChangeField("width", value)}
          />
        </Stack>
        <TextInput
          label="Basis"
          size="xs"
          {...form.getInputProps("flexBasis")}
          onChange={(e) => onChangeField("flexBasis", e.target.value)}
        />
      </Stack>
    </form>
  );
});

export default Modifier;
