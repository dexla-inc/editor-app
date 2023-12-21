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

const CustomDropdownComponent = forwardRef(
  ({ children, components, ...props }: any, ref) => {
    const isComponent = components.customText || components.customLinkText;
    return (
      <MantineBox ref={ref} component={ScrollArea} {...props}>
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
  },
);
CustomDropdownComponent.displayName = "CustomDropdown";

export const CustomDropdown = memo(
  withComponentWrapper<any>(CustomDropdownComponent),
  isSame,
);
