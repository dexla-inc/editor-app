import { MantineSize } from "@mantine/core";

type ModifierType = "input" | "gap" | "radius";

// Centralized size definitions
const sizeDefinitions = {
  xs: { input: "30px", gap: "8px", radius: "4px" },
  sm: { input: "36px", gap: "12px", radius: "8px" },
  md: { input: "40px", gap: "16px", radius: "10px" },
  lg: { input: "48px", gap: "24px", radius: "16px" },
  xl: { input: "60px", gap: "32px", radius: "32px" },
} as Record<MantineSize, Record<ModifierType, string>>;

// Utility function to create the records
const createSizeRecord = (key: keyof (typeof sizeDefinitions)["xs"]) => {
  return Object.fromEntries(
    Object.entries(sizeDefinitions).map(([size, values]) => [
      size,
      values[key],
    ]),
  ) as Record<MantineSize, string>;
};

export const inputSizes = createSizeRecord("input");
export const gapSizes = createSizeRecord("gap");
export const radiusSizes = createSizeRecord("radius");

export const convertSizeToPx = (size: MantineSize, type: ModifierType) => {
  if (sizeDefinitions[size]) {
    return sizeDefinitions[size][type];
  }
};
