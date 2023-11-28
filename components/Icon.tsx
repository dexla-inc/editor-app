import { ICON_SIZE } from "@/utils/config";
import { Box } from "@mantine/core";
import * as Icons from "@tabler/icons-react";

type Props = {
  name: string;
  size?: number;
  bg?: string;
} & Icons.TablerIconsProps;

export const Icon = ({ name, size = ICON_SIZE, ...props }: Props) => {
  // @ts-ignore
  const IconToRender = Icons[name];

  if (!IconToRender) {
    return null;
  }

  return (
    <Box
      bg={props.bg}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: props.style?.width,
        height: props.style?.height,
        borderRadius: props.style?.borderBottomLeftRadius,
      }}
    >
      <IconToRender size={size} {...props} />
    </Box>
  );
};
