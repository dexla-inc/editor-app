import { ICON_SIZE } from "@/utils/config";
import * as Icons from "@tabler/icons-react";

type Props = {
  name: string;
  size?: number;
} & Icons.TablerIconsProps;

export const Icon = ({ name, size = ICON_SIZE, ...props }: Props) => {
  // @ts-ignore
  const IconToRender = Icons[name];

  if (!IconToRender) {
    return null;
  }

  return <IconToRender size={size} {...props} />;
};
