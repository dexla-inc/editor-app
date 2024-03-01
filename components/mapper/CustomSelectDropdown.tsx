import { useEditorStore } from "@/stores/editor";
import {
  Anchor as MantineAnchor,
  Box as MantineBox,
  Group as MantineGroup,
  Text as MantineText,
  ScrollArea,
} from "@mantine/core";

type LinkProps = { text: string; link: string; url: string };

const FixedLink = ({ text, link, url }: LinkProps) => {
  const theme = useEditorStore((state) => state.theme);
  const fontSize = theme.fonts.find((font) => font.tag === "P")?.fontSize;
  return (
    <MantineGroup
      noWrap
      spacing={8}
      sx={{
        background: "#fff",
        borderTop: "1px solid #ddd",
        padding: "10px 15px",
      }}
    >
      {text && <MantineText size={fontSize}>{text}</MantineText>}
      {link && (
        <MantineAnchor
          href={url}
          target="_blank"
          variant="link"
          size={fontSize}
        >
          {link}
        </MantineAnchor>
      )}
    </MantineGroup>
  );
};

export const CustomDropdown = ({ children, ...props }: any) => {
  const component = useEditorStore(
    (state) => state.componentMutableAttrs[props.id.split("-").at(0)],
  );
  const isComponent =
    component?.props?.customText || component?.props?.customLinkText;
  return (
    <MantineBox component={ScrollArea} {...props}>
      {children}
      {isComponent && (
        <FixedLink
          text={component?.props?.customText}
          link={component?.props?.customLinkText}
          url={component?.props?.customLinkUrl}
        />
      )}
    </MantineBox>
  );
};
