import { ASIDE_WIDTH } from "@/utils/config";
import {
  Box,
  Center,
  Group,
  NumberInput,
  NumberInputProps,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconBoxMargin } from "@tabler/icons-react";

export const icon = IconBoxMargin;
export const label = "Spacing";

const ValueInput = (props: NumberInputProps) => {
  return (
    <NumberInput
      styles={{
        input: {
          textAlign: "center",
          fontSize: 10,
        },
      }}
      variant="unstyled"
      radius={0}
      hideControls
      size="xs"
      maw={50}
      value={0}
      {...props}
    />
  );
};

export const Modifier = () => {
  const theme = useMantineTheme();

  return (
    <Box w="100%" pos="relative">
      <Text
        pos="absolute"
        top={14}
        left={30}
        size={10}
        color="teal.6"
        weight="bold"
        sx={{ zIndex: 10 }}
      >
        Margin
      </Text>
      <Text
        pos="absolute"
        top={69}
        left={82}
        size={10}
        color="teal.6"
        weight="bold"
        sx={{ zIndex: 10 }}
      >
        Padding
      </Text>
      <Box
        top={0}
        left={0}
        pos="absolute"
        sx={{
          height: ASIDE_WIDTH - 32,
          width: ASIDE_WIDTH - 32,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 100 100"
          sx={{
            height: "100%",
            width: "100%",
            "> polygon": {
              fill: theme.colors.teal[0],
              stroke: theme.colors.teal[6],
              strokeLinejoin: "round",
              strokeWidth: 0.5,
            },
          }}
        >
          <polygon points="5,5 50,50 95,5" />
          <polygon
            points="5,5 50,50 5,95"
            style={{ fill: theme.colors.teal[1] }}
          />
          <polygon points="5,95 50,50 95,95" />
          <polygon
            points="95,5 50,50 95,95"
            style={{ fill: theme.colors.teal[1] }}
          />
          <rect
            x="25"
            y="25"
            width={50}
            height={50}
            style={{
              fill: "none",
              stroke: theme.colors.teal[6],
              strokeWidth: 1,
            }}
          />
          <rect
            x="42.5"
            y="42.5"
            width={15}
            height={15}
            style={{
              fill: "white",
              stroke: theme.colors.teal[6],
              strokeWidth: 1,
            }}
          />
        </Box>
      </Box>
      <Center>
        <Box h={ASIDE_WIDTH - 32} w={ASIDE_WIDTH - 32} pt={29}>
          <Center>
            <ValueInput />
          </Center>
          <Group w="100%" position="apart" noWrap spacing={0} px="md">
            <ValueInput />
            <Box w={160} h={150}>
              <Stack
                h="100%"
                spacing={4}
                sx={{ justifyContent: "center" }}
                p={2}
              >
                <Center>
                  <ValueInput />
                </Center>
                <Group w="100%" position="apart">
                  <ValueInput />
                  <ValueInput />
                </Group>
                <Center>
                  <ValueInput />
                </Center>
              </Stack>
            </Box>
            <ValueInput />
          </Group>
          <Center>
            <ValueInput />
          </Center>
        </Box>
      </Center>
    </Box>
  );
};
