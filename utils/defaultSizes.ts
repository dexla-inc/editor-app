import { MantineSize } from "@mantine/core";

// Centralized size definitions
const sizeDefinitions = {
  xs: { input: "30px", gap: "10px", radius: "2px" },
  sm: { input: "36px", gap: "12px", radius: "4px" },
  md: { input: "40px", gap: "16px", radius: "10px" },
  lg: { input: "48px", gap: "20px", radius: "16px" },
  xl: { input: "60px", gap: "24px", radius: "32px" },
};

// Utility function to create the records
function createSizeRecord(key: keyof (typeof sizeDefinitions)["xs"]) {
  return Object.fromEntries(
    Object.entries(sizeDefinitions).map(([size, values]) => [
      size,
      values[key],
    ]),
  ) as Record<MantineSize, string>;
}

export const inputSizes = createSizeRecord("input");
export const gapSizes = createSizeRecord("gap");
export const radiusSizes = createSizeRecord("radius");
