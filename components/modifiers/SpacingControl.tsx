import { Icon } from "@/components/Icon";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Flex, Group, SegmentedControl, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";

type Props = {
  type: "Padding" | "Margin";
  form: UseFormReturnType<any>;
  mode: "all" | "sides";
};

export const SpacingControl = ({ type, form, mode }: Props) => {
  const [currentMode, setCurrentMode] = useState(mode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const sideTypes = type === "Padding" ? "padding-sides" : "margin-sides";
  const allTypes = type === "Padding" ? "padding-all" : "margin-all";

  const handleUnifiedChange = (value: string) => {
    const newValues = {
      [`${type.toLowerCase()}`]: value,
      [`${type.toLowerCase()}Top`]: value,
      [`${type.toLowerCase()}Bottom`]: value,
      [`${type.toLowerCase()}Left`]: value,
      [`${type.toLowerCase()}Right`]: value,
    };
    form.setValues(newValues);

    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { style: newValues } },
    });
  };

  const handleSideChange = (
    side: "Top" | "Bottom" | "Left" | "Right",
    value: string,
  ) => {
    const key = `${type.toLowerCase()}${side}`;
    form.setFieldValue(key, value);
    debouncedTreeComponentAttrsUpdate({
      attrs: { props: { style: { [key]: value } } },
    });
  };

  const handleModeChange = (newValue: string) => {
    const newMode = newValue === allTypes ? "all" : "sides";
    setCurrentMode(newMode);

    // Clear all individual side values when switching to "all"
    if (newMode === "all") {
      const unifiedValue = form.values[`${type.toLowerCase()}Top`];
      const resetValues = {
        [`${type.toLowerCase()}Top`]: unifiedValue ?? "0px",
        [`${type.toLowerCase()}Bottom`]: unifiedValue ?? "0px",
        [`${type.toLowerCase()}Left`]: unifiedValue ?? "0px",
        [`${type.toLowerCase()}Right`]: unifiedValue ?? "0px",
      };
      form.setValues({
        ...form.values,
        ...resetValues,
        [`${type.toLowerCase()}`]: unifiedValue || "",
      });
      debouncedTreeComponentAttrsUpdate({
        attrs: {
          props: {
            style: {
              ...resetValues,
              [type.toLowerCase()]: unifiedValue || undefined,
            },
          },
        },
      });
    } else {
      // Reset unified value when switching to "sides"
      const resetValue = {
        [`${type.toLowerCase()}`]: undefined,
      };
      form.setValues({
        ...form.values,
        ...resetValue,
      });
      debouncedTreeComponentAttrsUpdate({
        attrs: { props: { style: resetValue } },
      });
    }
  };

  return (
    <Stack spacing={4}>
      <TopLabel text={type} size="0.75rem" />
      <Flex align="center" gap="sm" justify="space-between">
        <SegmentedControl
          fullWidth
          size="xs"
          w="100%"
          data={[
            {
              label: <Icon name="IconSquare" size={14} />,
              value: allTypes,
            },
            {
              label: <Icon name="IconBorderSides" size={14} />,
              value: sideTypes,
            },
          ]}
          value={currentMode === "all" ? allTypes : sideTypes}
          onChange={handleModeChange}
        />
        {currentMode === "all" && (
          <UnitInput
            {...form.getInputProps(`${type.toLowerCase()}`)}
            onChange={handleUnifiedChange}
          />
        )}
      </Flex>
      {currentMode === "sides" && (
        <>
          <Group noWrap>
            <UnitInput
              label="Top"
              {...form.getInputProps(`${type.toLowerCase()}Top`)}
              onChange={(value) => handleSideChange("Top", value)}
            />
            <UnitInput
              label="Bottom"
              {...form.getInputProps(`${type.toLowerCase()}Bottom`)}
              onChange={(value) => handleSideChange("Bottom", value)}
            />
          </Group>
          <Group noWrap>
            <UnitInput
              label="Left"
              {...form.getInputProps(`${type.toLowerCase()}Left`)}
              onChange={(value) => handleSideChange("Left", value)}
            />
            <UnitInput
              label="Right"
              {...form.getInputProps(`${type.toLowerCase()}Right`)}
              onChange={(value) => handleSideChange("Right", value)}
            />
          </Group>
        </>
      )}
    </Stack>
  );
};
