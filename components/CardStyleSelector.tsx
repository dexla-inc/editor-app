import { CardStyle } from "@/requests/projects/types";
import { INPUT_SIZE } from "@/utils/config";
import {
  MantineNumberSize,
  MantineSizes,
  Select,
  SelectProps,
} from "@mantine/core";

export const CardStyleSelector = (props: Omit<SelectProps, "data">) => {
  return (
    <Select
      label="Card Style"
      size={INPUT_SIZE}
      {...props}
      data={[
        { label: "Rounded", value: "ROUNDED" },
        { label: "Squared", value: "SQUARED" },
        { label: "Outlined", value: "OUTLINED" },
        { label: "Elevated", value: "ELEVATED" },
        { label: "Outlined Rounded", value: "OUTLINED_ROUNDED" },
        { label: "Outlined Squared", value: "OUTLINED_SQUARED" },
        { label: "Outlined Elevated", value: "OUTLINED_ELEVATED" },
        { label: "Elevated Rounded", value: "ELEVATED_ROUNDED" },
        { label: "Elevated Squared", value: "ELEVATED_SQUARED" },
        {
          label: "Elevated Outlined Rounded",
          value: "ELEVATED_OUTLINED_ROUNDED",
        },
        {
          label: "Elevated Outlined Squared",
          value: "ELEVATED_OUTLINED_SQUARED",
        },
      ]}
    />
  );
};

export type CardStyleProps = {
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  borderWidth?: string;
  boxShadow?: string;
};

export function getCardStyling(
  cardStyle: CardStyle,
  borderColor: string,
  radius: MantineNumberSize,
): CardStyleProps {
  const boxShadow = `rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px`;

  const styles: Record<CardStyle, CardStyleProps> = {
    ROUNDED: {
      borderRadius: "16px", // Hard code for Evalio for now
      borderStyle: "none",
      boxShadow: "none",
    },
    SQUARED: {
      borderRadius: convertMantineRadiusToPixels(0),
      boxShadow: "none",
      borderStyle: "none",
    },
    OUTLINED: {
      borderStyle: "solid",
      borderColor: borderColor,
      borderWidth: "1px",
      boxShadow: "none",
      borderRadius: convertMantineRadiusToPixels(0),
    },
    OUTLINED_ROUNDED: {
      borderStyle: "solid",
      borderColor: borderColor,
      borderRadius: convertMantineRadiusToPixels(radius),
      borderWidth: "1px",
      boxShadow: "none",
    },
    OUTLINED_SQUARED: {
      borderStyle: "solid",
      borderColor: borderColor,
      borderRadius: convertMantineRadiusToPixels(0),
      borderWidth: "1px",
      boxShadow: "none",
    },
    ELEVATED: {
      boxShadow: boxShadow,
      borderStyle: "none",
    },
    ELEVATED_ROUNDED: {
      borderRadius: convertMantineRadiusToPixels(radius),
      boxShadow: boxShadow,
      borderStyle: "none",
    },
    ELEVATED_SQUARED: {
      borderRadius: convertMantineRadiusToPixels(0),
      boxShadow: boxShadow,
      borderStyle: "none",
    },
    OUTLINED_ELEVATED: {
      borderStyle: "solid",
      borderColor: borderColor,
      borderWidth: "1px",
      boxShadow: boxShadow,
      borderRadius: convertMantineRadiusToPixels(0),
    },
    ELEVATED_OUTLINED_ROUNDED: {
      borderStyle: "solid",
      borderColor: borderColor,
      borderRadius: convertMantineRadiusToPixels(radius),
      borderWidth: "1px",
      boxShadow: boxShadow,
    },
    ELEVATED_OUTLINED_SQUARED: {
      borderStyle: "solid",
      borderColor: borderColor,
      borderRadius: convertMantineRadiusToPixels(0),
      borderWidth: "1px",
      boxShadow: boxShadow,
    },
  };

  // Fall back to an empty object if the value doesn't match
  return styles[cardStyle] || {};
}

export const mantineSizeToPixels: Record<
  Exclude<MantineNumberSize, number>,
  string
> = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  xl: "50%",
};

export const convertMantineRadiusToPixels = (
  radius: MantineNumberSize,
): string => {
  if (typeof radius === "number") {
    // If the value is a number, return it as pixels directly
    return `${radius}px`;
  } else if (typeof radius === "string") {
    // Look up the keyword in the mantineSizeToPixels map, or default to '0'
    return mantineSizeToPixels[radius] || "0";
  }

  // Fallback for string & {} type, which should not be used normally
  return "0";
};

const getMantineRadiusValue = (
  radius: MantineNumberSize,
): MantineSizes | undefined => {
  if (typeof radius === "number" || typeof radius === "string") {
    // Create an object with the same radius value for all sizes
    const radiusString = typeof radius === "number" ? `${radius}px` : radius;
    return {
      xs: radiusString,
      sm: radiusString,
      md: radiusString,
      lg: radiusString,
      xl: radiusString,
    };
  } else {
    // If radius is a specific MantineSize, you can create an object
    // that applies to all, assuming you want the same radius for all sizes.
    const radiusValue = {};
    radiusValue[radius] = radius; // The radius value should be a string here.
    return radiusValue as MantineSizes;
  }
};
