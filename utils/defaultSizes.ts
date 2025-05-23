import { MantineSize } from "@mantine/core";

type SizeDefinition = {
  input: string;
  gap: string;
  radius: string;
  badge?: string;
  modal: string;
};

// Centralized size definitions
const sizeDefinitions = {
  xxs: { input: "24px", gap: "4px", radius: "2px", modal: "320px" },
  xs: {
    input: "30px",
    gap: "8px",
    radius: "4px",
    badge: "20px",
    modal: "380px",
  },
  sm: {
    input: "36px",
    gap: "12px",
    radius: "8px",
    badge: "24px",
    modal: "440px",
  },
  md: {
    input: "40px",
    gap: "16px",
    radius: "10px",
    badge: "28px",
    modal: "552px",
  },
  lg: {
    input: "48px",
    gap: "24px",
    radius: "16px",
    badge: "32px",
    modal: "720px",
  },
  xl: {
    input: "60px",
    gap: "32px",
    radius: "32px",
    badge: "36px",
    modal: "1000px",
  },
} as Record<MantineSize, SizeDefinition>;

// Utility function to create the records
const createSizeRecord = (key: keyof (typeof sizeDefinitions)["xs"]) => {
  return Object.fromEntries(
    Object.entries(sizeDefinitions).map(([size, values]) => [
      size,
      values[key],
    ]),
  ) as Record<MantineSize, string | undefined>;
};

export const inputSizes = createSizeRecord("input");
export const gapSizes = createSizeRecord("gap");
export const radiusSizes = createSizeRecord("radius");
export const badgeSizes = createSizeRecord("badge");
export const modalSizes = createSizeRecord("modal");

export const convertSizeToPx = (
  size: MantineSize,
  type: keyof SizeDefinition,
) => {
  if (sizeDefinitions[size]) {
    return sizeDefinitions[size][type];
  }
};
