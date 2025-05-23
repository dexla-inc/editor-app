import { usePreventNavigationOnSaving } from "@/hooks/editor/usePreventNavigationOnSaving";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import {
  DARK_MODE,
  LIGHT_MODE,
  THIN_DARK_OUTLINE,
  THIN_GRAY_OUTLINE,
} from "@/utils/branding";
import { Box, Text } from "@mantine/core";
import { forwardRef } from "react";

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

export const SavingDisplay = forwardRef<HTMLDivElement>(({ ...props }, ref) => {
  usePreventNavigationOnSaving();

  const isSaving = useEditorTreeStore((state) => state.isSaving);

  const saving = isSaving ? "saving" : "saved";

  return (
    <Box
      ref={ref}
      {...props}
      sx={(theme) => ({
        border:
          theme.colorScheme === "dark" ? THIN_DARK_OUTLINE : THIN_GRAY_OUTLINE,
        backgroundColor: theme.colorScheme === "dark" ? DARK_MODE : LIGHT_MODE,
        width: 65,
        textAlign: "center",
        padding: 1,
        borderRadius: theme.radius.sm,
        cursor: "pointer",
      })}
    >
      <Text color={isSavingDisplay[saving].color} size="sm">
        {isSavingDisplay[saving].text}
      </Text>
    </Box>
  );
});

SavingDisplay.displayName = "SavingDisplay";
