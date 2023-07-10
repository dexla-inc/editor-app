import { getPageEventSource } from "@/requests/pages/queries";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Button, Modal, Stack, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { EventSourceMessage } from "@microsoft/fetch-event-source";

import { IconSparkles } from "@tabler/icons-react";
import { useState } from "react";

type GenerateAIButtonProps = {
  projectId: string;
  pageTitle?: string | undefined;
  // setStream: Dispatch<SetStateAction<string | undefined>>;
  // startLoading: (state: DexlaNotificationProps) => void;
  // stopLoading: (state: DexlaNotificationProps) => void;
};

export const GenerateAIButton = ({
  projectId,
  pageTitle = "Need to implement",
}: // setStream,
// startLoading,
// stopLoading,
GenerateAIButtonProps) => {
  const [openedAIModal, { open, close }] = useDisclosure(false);
  const [description, setDescription] = useState("");

  const generate = () => {
    // startLoading({
    //   id: "page-generation",
    //   title: "Generating Page",
    //   message: "AI is generating your page",
    // });

    const onMessage = (event: EventSourceMessage) => {
      try {
        // setStream((state) => {
        //   try {
        //     if (state === undefined) {
        //       return event.data;
        //     } else {
        //       return `${state}
        //       ${event.data}`;
        //     }
        //   } catch (error) {
        //     return state;
        //   }
        // });
      } catch (error) {
        // Do nothing as we expect the stream to not be parsable every time since it can just be halfway through
        console.error(error);
      }
    };

    const onError = (err: any) => {
      // stopLoading({
      //   id: "page-generation",
      //   title: "There was a problem",
      //   message: err,
      //   isError: true,
      // });
    };

    const onOpen = async (response: Response) => {
      // handle open
    };

    const onClose = async () => {
      // stopLoading({
      //   id: "page-generation",
      //   title: "Page Generated",
      //   message: "Here's your page. We hope you like it",
      // });
    };

    getPageEventSource(
      projectId,
      pageTitle,
      onMessage,
      onError,
      onOpen,
      onClose,
      description
    );
  };

  return (
    <>
      <ActionIcon
        onClick={open}
        variant="filled"
        color="teal"
        size="lg"
        sx={{ borderRadius: "50%" }}
      >
        <IconSparkles size={ICON_SIZE} />
      </ActionIcon>
      <Modal
        size="lg"
        opened={openedAIModal}
        onClose={close}
        title="Generate AI Content"
      >
        <Stack>
          <Textarea
            label="Description"
            description="Describe what you want to generate or change with the page"
            placeholder="Delete breadcrumbs, change the title from Dashboard to Metrics Dashboard, move the form to the right and add an image to the left"
            withAsterisk
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
          />
          <Button
            leftIcon={<IconSparkles size={ICON_SIZE} />}
            onClick={generate}
            disabled
          >
            Generate
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
