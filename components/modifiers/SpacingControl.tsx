import { Icon } from "@/components/Icon";
import { TopLabel } from "@/components/TopLabel";
import { UnitInput } from "@/components/UnitInput";
import { debouncedTreeUpdate } from "@/utils/editor";
import { Flex, Group, SegmentedControl, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconBoxModel2 } from "@tabler/icons-react";

export const icon = IconBoxModel2;
export const label = "Spacing";

type Props = {
  type: "Padding" | "Margin";
  form: UseFormReturnType<any>;
  selectedComponentIds: string[];
};

export const SpacingControl = ({ type, form, selectedComponentIds }: Props) => {
  const sideTypes = type === "Padding" ? "padding-sides" : "margin-sides";
  const allTypes = type === "Padding" ? "padding-all" : "margin-all";

  const showType = form.values[`show${type}`];
  const setTypeValue = form.setFieldValue;

  const handleUnifiedChange = (value: string) => {
    const newValues = {
      [`${type.toLowerCase()}`]: value,
      [`${type.toLowerCase()}Top`]: value,
      [`${type.toLowerCase()}Bottom`]: value,
      [`${type.toLowerCase()}Left`]: value,
      [`${type.toLowerCase()}Right`]: value,
    };
    form.setValues(newValues);

    debouncedTreeUpdate(selectedComponentIds, {
      style: newValues,
    });
  };

  const handleSideChange = (
    side: "Top" | "Bottom" | "Left" | "Right",
    value: string,
  ) => {
    setTypeValue(`${type.toLowerCase()}${side}`, value);
    debouncedTreeUpdate(selectedComponentIds, {
      style: { [`${type.toLowerCase()}${side}`]: value },
    });
  };

  return (
    <Stack spacing={4}>
      <TopLabel text={type} size="0.75rem" />
      {showType}
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
          value={showType}
          onChange={(newValue) => {
            const commonKey = `${type.toLowerCase()}`;
            const topKey = `${commonKey}Top`;
            if (newValue === allTypes && showType === sideTypes) {
              // Changing from sideTypes to allTypes
              const newUnifiedValue = form.values[topKey];
              handleUnifiedChange(newUnifiedValue);
            }
            if (newValue === sideTypes && showType === allTypes) {
              // Changing from allTypes to sideTypes
              const newSideValue = form.values[commonKey];
              ["Top", "Bottom", "Left", "Right"].forEach((side) => {
                handleSideChange(
                  side as "Top" | "Bottom" | "Left" | "Right",
                  newSideValue,
                );
              });
            }
            // Update showType value
            console.log(`show${type}`, newValue);
            setTypeValue(`show${type}`, newValue);
          }}
        />
        {showType === allTypes && (
          <UnitInput
            {...form.getInputProps(type.toLowerCase())}
            onChange={handleUnifiedChange}
          />
        )}
      </Flex>
      {showType === sideTypes && (
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
