import { useDataSources } from "@/hooks/editor/reactQuery/useDataSources";
import { getSwagger } from "@/requests/datasources/queries";
import {
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { useState } from "react";
import { ActionIconDefault } from "../ActionIconDefault";
import { useEditorTreeStore } from "@/stores/editorTree";

type Props = {
  datasourceId: string;
  updated: number;
} & TextInputProps;

export const SwaggerURLInputRevised = ({
  datasourceId,
  updated,
  ...props
}: Props) => {
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const [isLoading, setIsLoading] = useState(false);
  const lastUpdated = new Date(updated).toLocaleString();
  const { invalidate: invalidate } = useDataSources(projectId);

  const refetchSwagger = async () => {
    try {
      setIsLoading(true);
      await getSwagger(projectId, datasourceId, props.value as string);
      invalidate();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      <Flex align="end" gap="xs">
        <TextInput
          label="Swagger URL"
          w="100%"
          rightSection={isLoading && <Loader size="xs" />}
          disabled={isLoading}
          value={props.value}
          {...props}
        />
        <ActionIconDefault
          tooltip="Get Latest API"
          iconName="IconRefresh"
          onClick={refetchSwagger}
        />
      </Flex>
      <Flex gap="xs">
        <Text size="xs">Last Updated:</Text>
        <Text size="xs" color="dimmed">
          {lastUpdated}
        </Text>
      </Flex>
    </Stack>
  );
};
