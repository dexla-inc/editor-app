import { Box, Stack, Text, TextInput, Title } from "@mantine/core";

export type Props = {
  form: any;
  selectableObjectKeys: string[];
};

export const TableDataForm = ({ form, selectableObjectKeys }: Props) => {
  return (
    <Stack spacing="xs" my="xs">
      <Box>
        <Title order={6} mt="xs">
          Table display
        </Title>
        <Text size="xs" color="dimmed">
          Set up the data structure
        </Text>
      </Box>
      <TextInput label="Columns" {...form.getInputProps("columns")} />
    </Stack>
  );
};
