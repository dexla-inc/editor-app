import {
  Anchor as MantineAnchor,
  Box as MantineBox,
  Group as MantineGroup,
  Text as MantineText,
  ScrollArea,
} from "@mantine/core";
import { forwardRef, memo } from "react";
import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { isSame } from "@/utils/componentComparison";
import { getComponentById } from "@/utils/editor";
import { useEditorStore } from "@/stores/editor";

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

export const CustomDropdown = ({ children, ...props }: any) => {
  const editorTree = useEditorStore((state) => state.tree);
  const component = getComponentById(
    editorTree.root,
    props.id.split("-").at(0),
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
