import {
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import { useState } from "react";

type Props = {
  datasourceId: string;
  updated: number;
} & TextInputProps;

export const SwaggerURLInputRevised = ({
  datasourceId,
  updated,
  ...props
}: Props) => {
  return (
    <Stack>
      <Flex align="end" gap="xs">
        <TextInput
          label="Swagger URL"
          w="100%"
          value={props.value}
          {...props}
        />
      </Flex>
    </Stack>
  );
};
