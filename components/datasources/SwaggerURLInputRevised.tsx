import { getSwagger } from "@/requests/datasources/queries";
import { useEditorStore } from "@/stores/editor";
import { Flex, Loader, TextInput, TextInputProps } from "@mantine/core";
import { useState } from "react";
import { ActionIconDefault } from "../ActionIconDefault";

type Props = {
  datasourceId: string;
} & TextInputProps;

export const SwaggerURLInputRevised = ({ datasourceId, ...props }: Props) => {
  const projectId = useEditorStore((state) => state.currentProjectId) as string;
  const [isLoading, setIsLoading] = useState(false);

  const refetchSwagger = async () => {
    try {
      setIsLoading(true);
      await getSwagger(projectId, datasourceId, props.value as string);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};
