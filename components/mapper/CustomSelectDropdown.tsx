import {
  Anchor as MantineAnchor,
  Box as MantineBox,
  Group as MantineGroup,
  Text as MantineText,
  ScrollArea,
} from "@mantine/core";

type LinkProps = { text: string; link: string; url: string };

const FixedLink = ({ text, link, url }: LinkProps) => (
  <MantineGroup
    noWrap
    spacing={8}
    sx={{
      background: "#fff",
      borderTop: "1px solid #ddd",
      padding: "10px 15px",
    }}
  >
    {text && <MantineText size="sm">{text}</MantineText>}
    {link && (
      <MantineAnchor href={url} target="_blank" variant="link">
        {link}
      </MantineAnchor>
    )}
  </MantineGroup>
);

export const CustomDropdown = ({ children, components, ...props }: any) => {
  const isComponent = components.customText || components.customLinkText;
  return (
    <MantineBox component={ScrollArea} {...props}>
      {children}
      {isComponent && (
        <FixedLink
          text={components.customText}
          link={components.customLinkText}
          url={components.customLinkUrl}
        />
      )}
    </MantineBox>
  );
};
