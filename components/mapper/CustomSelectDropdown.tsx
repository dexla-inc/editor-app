import { useEditorTreeStore } from "@/stores/editorTree";
import { useThemeStore } from "@/stores/theme";
import {
  Box as MantineBox,
  Group as MantineGroup,
  Text as MantineText,
  ScrollArea,
} from "@mantine/core";
import Link from "next/link";

type LinkProps = { text: string; link: string; url: string; isLive: boolean };

const FixedLink = ({ text, link, url, isLive }: LinkProps) => {
  const theme = useThemeStore((state) => state.theme);
  const projectId = useEditorTreeStore((state) => state.currentProjectId);
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
        <Link
          href={url}
          as={!isLive ? `/projects/${projectId}/editor/${url}` : url}
          style={{ fontSize: fontSize, color: theme.colors.Primary[6] }}
        >
          {link}
        </Link>
      )}
    </MantineGroup>
  );
};

export const CustomDropdown = ({ children, footer, ...props }: any) => {
  const component = useEditorTreeStore(
    (state) => state.componentMutableAttrs[props.id.split("-").at(0)],
  );

  const isLive = useEditorTreeStore((state) => state.isLive);

  const isComponent =
    component?.props?.customText || component?.props?.customLinkText;

  const customLinkUrl = component?.props?.customLinkUrl;
  const id = customLinkUrl?.split("|")[0];
  const slug = customLinkUrl?.split("|")[1];

  return (
    <MantineBox component={ScrollArea} {...props}>
      {children}
      {isComponent && (
        <FixedLink
          text={component?.props?.customText}
          link={component?.props?.customLinkText}
          url={isLive ? slug : id}
          isLive={isLive}
        />
      )}
      {footer && footer}
    </MantineBox>
  );
};
