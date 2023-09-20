import { ICON_SIZE } from "@/utils/config";
import * as Icons from "@tabler/icons-react";
import { Box } from "@mantine/core";

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
      unstyled
      bg={props.bg}
      style={{
        width: props.style?.width,
        height: props.style?.height,
        borderRadius: props.style?.borderBottomLeftRadius,
      }}
    >
      <IconToRender size={size} {...props} />
    </Box>
  );
};
