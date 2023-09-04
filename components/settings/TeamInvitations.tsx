import { WarningAlert } from "@/components/Alerts";
import { acceptInvite, getTeamsList } from "@/requests/teams/queries";
import { AcceptInviteParams, TeamResponse } from "@/requests/teams/types";
import { TeamStatus } from "@/utils/dashboardTypes";
import { Button, Flex, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export default function TeamInvitations() {
  const [pendingInviteList, setPendingInviteList] = useState<TeamResponse[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invitedResponse = await getTeamsList({ status: "INVITED" });

        setPendingInviteList(invitedResponse.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleAcceptOrRejectInvite = async (
    id: string,
    status: Extract<TeamStatus, "ACCEPTED" | "REJECTED">
  ) => {
    const params: AcceptInviteParams = { id, status };
    const response = await acceptInvite(params);

    setPendingInviteList([]);
  };

  return (
    <Stack>
      {pendingInviteList.map((invitation, index) => (
        <WarningAlert title="Pending Invitations" isHtml key={index}>
          <Stack>
            <Text>
              You have a pending invitation. Click accept to and start editing
              with your team.
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
    </Stack>
  );
}
