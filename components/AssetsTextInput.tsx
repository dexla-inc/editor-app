import { ShowAssetsLink } from "@/components/ShowAssetsLink";
import { Box, TextInput, TextInputProps } from "@mantine/core";

export const AssetsTextInput = (props: TextInputProps) => {
  return (
    <Box>
      <TextInput {...props} />
      <ShowAssetsLink />
    </Box>
  );
};
