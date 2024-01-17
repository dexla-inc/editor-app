import { TextInput } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import { EndpointSelect } from "../EndpointSelect";
import { SidebarSection } from "../SidebarSection";

type Props = {
  initiallyOpened: boolean;
  onClick: (id: string, isOpen: boolean) => void;
  endpointSelectProps: any;
  onChange: (selected: string) => void;
};

export const DynamicDataSettings = ({
  initiallyOpened,
  onClick,
  endpointSelectProps,
  onChange,
}: Props) => {
  return (
    <SidebarSection
      id="data"
      noPadding={true}
      initiallyOpened={initiallyOpened}
      label="Load Data"
      icon={IconDatabase}
      onClick={onClick}
    >
      <EndpointSelect {...endpointSelectProps} onChange={onChange} />
      <TextInput size="xs" label="Results key" placeholder="user.list" />
    </SidebarSection>
  );
};
