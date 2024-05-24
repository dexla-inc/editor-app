import { Icon } from "@/components/Icon";
import { ICON_SIZE } from "@/utils/config";
import { Button, Loader, NavLink, NavLinkProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  label: string;
  icon: string;
  pathName: string;
} & NavLinkProps;

export const DashboardNavLink = ({
  label,
  icon,
  pathName,
  ...props
}: Props) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <NavLink
      label={label}
      icon={<Icon name={icon} />}
      active={pathname === pathName}
      component={Link}
      href={pathName}
      onClick={() => setIsLoading(true)}
      rightSection={
        isLoading ? (
          <Loader size="xs" />
        ) : pathName === "/team" ? (
          <Button
            leftIcon={<IconPlus size={ICON_SIZE} />}
            compact
            variant="default"
          >
            Invite
          </Button>
        ) : null
      }
      {...props}
    />
  );
};
