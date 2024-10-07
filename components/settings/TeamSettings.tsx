"use client";

import { Icon } from "@/components/Icon";
import { inviteTeam } from "@/requests/teams/mutations";
import { getTeamsList } from "@/requests/teams/queries";
import { InviteTeamParams, UserResponse } from "@/requests/teams/types";
import { useAppStore } from "@/stores/app";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { UserRoles, snakeToSpacedText } from "@/types/dashboardTypes";
import {
  Button,
  Container,
  Flex,
  Modal,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import LoadingOverlay from "@/components/LoadingOverlay";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";

type Props = {
  projectId: string;
};

export default function TeamSettings({ projectId }: Props) {
  const [teamList, setTeamList] = useState<UserResponse[]>([]);
  const [email, setEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRoles>("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const theme = useMantineTheme();

  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);

  const company = usePropelAuthStore((state) => state.activeCompany);
  const companyId = usePropelAuthStore((state) => state.activeCompanyId);
  const userPermissions = usePropelAuthStore((state) => state.userPermissions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const users = await getTeamsList(companyId);

        setTeamList(users.results);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [companyId]);

  const handleInvite = async () => {
    try {
      startLoading({
        id: "inviting-user",
        title: "Inviting User",
        message: "Sending the invitation...",
      });
      setIsLoading(true);
      const params: InviteTeamParams = {
        email,
        accessLevel: userRole,
        companyId: company.orgId,
      };

      await inviteTeam(params);

      closeInviteModal();
      stopLoading({
        id: "inviting-user",
        title: "User Invited",
        message: "The user was invited successfully.",
      });
      setIsLoading(false);
    } catch (error) {
      stopLoading({
        id: "inviting-user",
        title: "Failed to Invite",
        message: "An error occurred while inviting the user.",
        isError: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell>
      <Container py="xl">
        <Stack spacing="xl">
          <Flex justify="space-between">
            <Title order={3}>Members</Title>

            {userPermissions.includes("propelauth::can_invite") && (
              <Button
                onClick={openInviteModal}
                leftIcon={<Icon name="IconPlus" size={ICON_SIZE}></Icon>}
                variant="default"
                compact
              >
                Invite Member
              </Button>
            )}
          </Flex>
          <Table>
            <thead>
              <tr>
                <th style={{ width: LARGE_ICON_SIZE }}></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Enabled</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {teamList.map((user, index) => (
                <tr key={index}>
                  <td>
                    <Image
                      src={user.pictureUrl}
                      alt={user.firstName + " photo"}
                      width={LARGE_ICON_SIZE}
                      height={LARGE_ICON_SIZE}
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{user.firstName + " " + user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{snakeToSpacedText(user.accessLevel)}</td>
                  <td>
                    {user.enabled ? (
                      <IconCircleCheck
                        size={LARGE_ICON_SIZE}
                        style={{ color: theme.colors.teal[6] }}
                      />
                    ) : (
                      <IconCircleX
                        size={LARGE_ICON_SIZE}
                        style={{ color: "red" }}
                      />
                    )}
                  </td>
                  <td>{new Date(user.createdAt * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Change this over to use a table skeleton */}
          <LoadingOverlay visible={isLoading} radius="sm" />
        </Stack>
        <Modal
          opened={isInviteModalOpen}
          onClose={closeInviteModal}
          title="Invite User"
        >
          <Stack mb={80}>
            <TextInput
              label="Email"
              placeholder="Enter email address"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
            ></TextInput>
            <Select
              label="Role"
              data={[
                {
                  value: "OWNER",
                  label: "Owner",
                },
                {
                  value: "ADMIN",
                  label: "Admin",
                },
                {
                  value: "MEMBER",
                  label: "Member",
                },
                {
                  value: "GUEST",
                  label: "Guest",
                },
              ]}
              value={userRole}
              onChange={(value: UserRoles) => setUserRole(value)}
              dropdownPosition="bottom"
            />
            <Button
              onClick={handleInvite}
              loading={isLoading}
              disabled={isLoading || email === ""}
            >
              Invite User
            </Button>
          </Stack>
        </Modal>
      </Container>
    </DashboardShell>
  );
}
