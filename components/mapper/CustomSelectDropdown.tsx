import { Anchor, Box, Group, Text } from "@mantine/core";

type LinkProps = { text: string; link: string; url: string };

const FixedLink = ({ text, link, url }: LinkProps) => (
  <Group
    noWrap
    spacing={8}
    sx={{
      background: "#fff",
      borderTop: "1px solid #ddd",
      padding: "10px 15px",
    }}
  >
    {text && <Text size="sm">{text}</Text>}
    {link && (
      <Anchor href={url} target="_blank" variant="link">
        {link}
      </Anchor>
    )}
  </Group>
);

export const CustomDropdown = ({ children, components, ...props }: any) => {
  const isComponent = components.customText || components.customLinkText;
  return (
    <Box {...props}>
      {children}
      {isComponent && (
        <FixedLink
          text={components.customText}
          link={components.customLinkText}
          url={components.customLinkUrl}
        />
      )}
    </Box>
  );
};
