import { Breadcrumbs, Text } from "@mantine/core";

export const Breadcrumb = () => {
  const items = [
    { title: "Home" },
    { title: "Settings" },
    { title: "About" },
  ].map((item, index) => (
    <Text size="sm" key={index}>
      {item.title}
    </Text>
  ));

  return (
    <Breadcrumbs w="100%" py="xl" px="md">
      {items}
    </Breadcrumbs>
  );
};
