import { WarningAlert } from "@/components/Alerts";
import { Icon } from "@/components/Icon";
import { inviteTeam } from "@/requests/teams/mutations";
import { acceptInvite, getTeamsList } from "@/requests/teams/queries";
import {
  AcceptInviteParams,
  InviteTeamParams,
  TeamResponse,
} from "@/requests/teams/types";
import { useAppStore } from "@/stores/app";
import { ICON_SIZE } from "@/utils/config";
import { TeamStatus, UserRoles } from "@/utils/dashboardTypes";
import {
  Button,
  Container,
  Flex,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
};

export default function TeamSettings({ projectId }: Props) {
  const [teamList, setTeamList] = useState<TeamResponse[]>([]);
  const [pendingInviteList, setPendingInviteList] = useState<TeamResponse[]>(
    [],
  );
  const [email, setEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRoles>("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const openInviteModal = () => setInviteModalOpen(true);
  const closeInviteModal = () => setInviteModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamResponse, invitedResponse] = await Promise.all([
          getTeamsList(),
          getTeamsList({ status: "INVITED" }),
        ]);

        setTeamList(teamResponse.results);
        setPendingInviteList(invitedResponse.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
        projectId: projectId,
      };
      const response = await inviteTeam(params);
      setTeamList([...teamList, response]);
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

  const handleAcceptOrRejectInvite = async (
    id: string,
    status: Extract<TeamStatus, "ACCEPTED" | "REJECTED">,
  ) => {
    const params: AcceptInviteParams = { id, status };
    const response = await acceptInvite(params);

    const updatedTeamList = teamList.filter(
      (team) => team.usersName !== response.usersName,
    );
    setTeamList([...updatedTeamList, response]);
    setPendingInviteList([]);
  };

  return (
    <Container py="xl">
      <Stack spacing="xl">
        {pendingInviteList.length > 0 && (
          <>
            <Title order={3}>Pending Invitations</Title>
            {pendingInviteList.map((invitation, index) => (
              <WarningAlert title="Pending Invitations" isHtml key={index}>
                <Stack>
                  <Text>
                    You have a pending invitation for this project. Click accept
                    to edit with your team.
                  </Text>
                  <Flex gap="md">
                    <Button
                      onClick={() =>
                        handleAcceptOrRejectInvite(invitation.id, "ACCEPTED")
                      }
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() =>
                        handleAcceptOrRejectInvite(invitation.id, "REJECTED")
                      }
                      color="red"
                    >
                      Reject
                    </Button>
                  </Flex>
                </Stack>
              </WarningAlert>
            ))}
          </>
        )}

        <Flex justify="space-between">
          <Title order={2}>Team Settings</Title>
          <Button
            onClick={openInviteModal}
            leftIcon={<Icon name="IconPlus" size={ICON_SIZE}></Icon>}
          >
            Invite User
          </Button>
        </Flex>
        <Table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Access Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teamList.map((team, index) => (
              <tr key={index}>
                <td>{team.usersName}</td>
                <td>{team.email}</td>
                <td>{team.accessLevel}</td>
                <td>{team.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
      <Modal
        opened={isInviteModalOpen}
        onClose={closeInviteModal}
        title="Invite User"
      >
        <Stack mb={80}>
          <Select
            label="Email"
            placeholder="Enter email address"
            data={[
              {
                value: "reinaldo@dexla.ai",
                label: "reinaldo@dexla.ai",
              },
              {
                value: "marcelo@dexla.ai",
                label: "marcelo@dexla.ai",
              },
              {
                value: "tom@dexla.ai",
                label: "tom@dexla.ai",
              },
              {
                value: "williams@dexla.ai",
                label: "williams@dexla.ai",
              },
              {
                value: "jade@dexla.ai",
                label: "jade@dexla.ai",
              },
            ]}
            value={email}
            onChange={(value: string) => setEmail(value)}
          />
          <Select
            label="Role"
            data={[
              {
                value: "MEMBER",
                label: "Member",
              },
              {
                value: "ADMIN",
                label: "Admin",
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
  );
}
