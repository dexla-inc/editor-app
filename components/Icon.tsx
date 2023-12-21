import { globalStyles } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { Box, CSSObject, MantineSize } from "@mantine/core";
import * as Icons from "@tabler/icons-react";
import { forwardRef } from "react";

type Props = {
  name: string;
  size?: number | MantineSize;
  bg?: string;
  sx: CSSObject;
} & Icons.TablerIconsProps;

export const Icon = forwardRef(
  ({ name, size = ICON_SIZE, ...props }: Props, ref) => {
    // @ts-ignore
    const IconToRender = Icons[name];

    if (!IconToRender) {
      return null;
    }

    const sizeAsNumber =
      typeof size === "number" ? size : globalStyles().sizing.icon[size];
    console.log(props);
    return (
      <Box
        // @ts-ignore
        ref={ref}
        unstyled
        bg={props.bg}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: props.style?.width,
          height: props.style?.height,
          borderRadius: props.style?.borderBottomLeftRadius,
        }}
        sx={{ ...props.sx }}
      >
        <IconToRender size={sizeAsNumber} {...props} />
      </Box>
    );
  },
);
Icon.displayName = "Icon";
