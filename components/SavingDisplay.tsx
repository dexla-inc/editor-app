import { Box, Text, useMantineTheme } from "@mantine/core";

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

export const SavingDisplay = ({ isSaving }: SavingDisplayProps) => {
  const saving = isSaving ? "saving" : "saved";
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        border: theme.colors.gray[3] + " solid 1px",
        backgroundColor: theme.colors.gray[1],
        width: 75,
        textAlign: "center",
        padding: 4,
        height: 34,
        borderRadius: 4,
      }}
    >
      <Text color={isSavingDisplay[saving].color}>
        {isSavingDisplay[saving].text}
      </Text>
    </Box>
  );
};
