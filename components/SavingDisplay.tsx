import { Box, Text, useMantineTheme } from "@mantine/core";
import { forwardRef } from "react";

type SavingDisplayProps = {
  isSaving: boolean;
};

const isSavingDisplay = {
  saving: {
    text: "Saving",
    color: "#FFB800",
  },
  saved: {
    text: "Saved",
    color: "#10D48E",
  },
};

export const SavingDisplay = forwardRef<HTMLDivElement, SavingDisplayProps>(
  ({ isSaving, ...props }: SavingDisplayProps, ref) => {
    const saving = isSaving ? "saving" : "saved";
    const theme = useMantineTheme();

    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          border: theme.colors.gray[3] + " solid 1px",
          backgroundColor: theme.colors.gray[1],
          width: 65,
          textAlign: "center",
          padding: 3,
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        <Text color={isSavingDisplay[saving].color} size="sm">
          {isSavingDisplay[saving].text}
        </Text>
      </Box>
    );
  },
);

SavingDisplay.displayName = "SavingDisplay";
