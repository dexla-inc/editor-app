import { createCustomComponent } from "@/requests/projects/mutations";
import { useEditorStore } from "@/stores/editor";
import { encodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import { Component, getComponentById, replaceIdsDeeply } from "@/utils/editor";
import { Modal, Stack, Group, TextInput, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconNewSection } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

type Props = {
  customComponentModal: any;
  isCustomComponentModalOpen: boolean;
};

export const CustomComponentModal = ({
  customComponentModal,
  isCustomComponentModalOpen,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );

  const { mutate } = useMutation(createCustomComponent, {
    onSettled(_, err) {
      if (err) {
        console.log(err);
        showNotification({
          title: "Oops",
          message:
            "Something went wrong while trying to create the custom component.",
          autoClose: true,
          color: "red",
          withBorder: true,
        });
      } else {
        showNotification({
          title: "Custom Component Saved",
          message: "Your Custom Component was saved successfully.",
          autoClose: true,
          withBorder: true,
        });
        queryClient.invalidateQueries(["components"]);
      }
    },
  });

  const customComponentForm = useForm({
    initialValues: {
      name: "",
      scope: "project",
    },
  });

  const handleSubmitCustomComponent = (values: any) => {
    customComponentModal.close();
    const component = getComponentById(
      editorTree.root,
      selectedComponentId as string
    );

    const copy = { ...component } as Component;
    replaceIdsDeeply(copy);

    mutate({
      values: {
        ...values,
        content: encodeSchema(JSON.stringify(copy)) as string,
        type: copy?.name,
      },
      projectId: router.query.id as string,
    });
  };

  return (
    <Modal
      centered
      title="New Custom Component"
      onClose={customComponentModal.close}
      opened={isCustomComponentModalOpen}
    >
      <form
        onSubmit={customComponentForm.onSubmit(handleSubmitCustomComponent)}
      >
        <Stack>
          <Group noWrap>
            <TextInput
              data-autofocus
              label="Name"
              withAsterisk={false}
              {...customComponentForm.getInputProps("name")}
            />
            <Select
              withinPortal
              label="Scope"
              data={[
                { label: "Global", value: "global" },
                { label: "Company", value: "company" },
                { label: "Project", value: "project" },
              ]}
              dropdownPosition="bottom"
              {...customComponentForm.getInputProps("scope")}
            />
          </Group>
          <Button leftIcon={<IconNewSection size={ICON_SIZE} />} type="submit">
            Save New Component
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
