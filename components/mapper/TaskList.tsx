import { Card, Center, List, ThemeIcon } from "@mantine/core";
import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";

const items = [
  {
    isDone: true,
    text: "Clone or download repository from GitHub",
  },
  {
    isDone: true,
    text: "Install dependencies with yarn",
  },
  {
    isDone: true,
    text: "Start development by running the start command",
  },
  {
    isDone: false,
    text: "Run tests to make sure your changes do not break the build",
  },
  {
    isDone: false,
    text: "Submit a pull request once you are done",
  },
];

export const TaskList = () => {
  return (
    <Card withBorder w="100%" h="100%">
      <Center>
        <List
          spacing="xs"
          size="sm"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleCheck size="1rem" />
            </ThemeIcon>
          }
        >
          {items.map((item) => {
            return (
              <List.Item
                key={item.text}
                icon={
                  item.isDone ? undefined : (
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCircleDashed size="1rem" />
                    </ThemeIcon>
                  )
                }
              >
                {item.text}
              </List.Item>
            );
          })}
        </List>
      </Center>
    </Card>
  );
};
