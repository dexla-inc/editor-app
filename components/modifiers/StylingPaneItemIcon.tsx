import { Flex, Tooltip } from "@mantine/core";

type EditorIconProps = {
  icon: JSX.Element;
  label: string;
};

export const StylingPaneItemIcon = ({ icon, label }: EditorIconProps) => {
  return (
    <Tooltip label={label} withinPortal>
      <Flex sx={{ width: "100%" }} justify="center">
        {icon}
      </Flex>
    </Tooltip>
  );
};
