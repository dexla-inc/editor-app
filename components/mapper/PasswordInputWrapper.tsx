import { Box, PasswordInputProps, Progress } from "@mantine/core";
import React from "react";

type Props = Omit<PasswordInputProps, "value"> & {
  children: React.ReactNode;
  isPreviewMode: boolean;
  value: string;
  requirements: any;
  [key: string]: any;
};

function getStrength(password: string, requirements: any) {
  let multiplier = password?.length > 5 ? 0 : 1;

  requirements?.forEach((requirement: any) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export const PasswordInputWrapper = ({
  children,
  isPreviewMode,
  value,
  requirements,
  ...props
}: Props) => {
  const strength = getStrength(value, requirements);
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: "0ms" } }}
        value={
          value && value.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));

  return (
    <>
      {children}
      {isPreviewMode && <Box></Box>}
    </>
  );
};
