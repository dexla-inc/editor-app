import { Flex, Stack, Title, UnstyledButton } from "@mantine/core";
import Image from "next/image";

export type AppId = "rss_feed";

export type AppProp = {
  id: AppId;
  name: string;
  image: string;
  onClick: () => void;
};

export const AppItem = ({ id, name, image, onClick }: AppProp) => {
  return (
    <UnstyledButton p="xs" ml="xs" w="100%" bg="gray.9" onClick={onClick}>
      <Stack justify="center" align="center" w="100%">
        <Flex align="center" w="100%" gap="xs" justify="center">
          <Title order={4} align="center">
            {name}
          </Title>
        </Flex>
        <Image src={image} width={100} height={70} alt={name} />
      </Stack>
    </UnstyledButton>
  );
};
