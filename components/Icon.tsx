import { globalStyles } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { Box, CSSObject, MantineSize } from "@mantine/core";
import * as Icons from "@tabler/icons-react";
import { ForwardedRef, forwardRef } from "react";

type Props = {
  name: string;
  size?: number | MantineSize;
  bg?: string;
  sx?: CSSObject;
} & Icons.TablerIconsProps;

export const Icon = forwardRef(
  ({ name, size = ICON_SIZE, ...props }: Props, ref: ForwardedRef<any>) => {
    // @ts-ignore
    const IconToRender = Icons[name];

    if (!IconToRender) {
      return null;
    }

    const sizeAsNumber =
      typeof size === "number" ? size : globalStyles().sizing.icon[size];

    return <IconToRender size={sizeAsNumber} {...props} />;
  },
);
Icon.displayName = "Icon";
