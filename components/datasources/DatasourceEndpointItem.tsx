import { Box, Text } from "@mantine/core";

type DatasourceEndpointItemProps = {
  projectId: string;
};

export default function DatasourceEndpointItem({
  projectId,
}: DatasourceEndpointItemProps) {
  return (
    <Box>
      <Text>DatasourceEndpointItem</Text>
    </Box>
  );
}
