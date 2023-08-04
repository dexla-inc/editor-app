import * as Icons from "@tabler/icons-react";

type Props = {
  name: string;
} & Icons.TablerIconsProps;

export const Icon = ({ name, ...props }: Props) => {
  // @ts-ignore
  const IconToRender = Icons[name];
  console.log(name);
  if (!IconToRender) {
    return null;
  }

  return <IconToRender {...props} />;
};
