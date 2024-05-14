import { Icon } from "@/components/Icon";
import { ActionIcon, Flex, Title, Tooltip } from "@mantine/core";
import { getTitle } from "./DataSourceEndpointDetail";
import { ApiType } from "@/types/dashboardTypes";

type Props = {
  apiType: ApiType;
  onClick: (apiType: ApiType) => void;
  bodyType?: "raw" | "fields";
};

export const AddRequestInput = ({ apiType, onClick, bodyType }: Props) => (
  <Flex align="center" gap="sm">
    <Tooltip label={`Add new ${apiType}`}>
      <ActionIcon
        variant="filled"
        radius="xl"
        color="indigo"
        onClick={() => onClick(apiType)}
        disabled={bodyType === "raw"}
      >
        <Icon name="IconPlus" />
      </ActionIcon>
    </Tooltip>

    <Title order={6}>{getTitle({ apiType })}</Title>
  </Flex>
);
