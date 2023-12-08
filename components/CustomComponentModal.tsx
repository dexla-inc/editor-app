import { createCustomComponent } from "@/requests/components/mutations";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { structureMapper } from "@/utils/componentMapper";
import { encodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import { Component, getComponentById, replaceIdsDeeply } from "@/utils/editor";
import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconNewSection } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cloneDeep from "lodash.clonedeep";
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
    (state) => state.selectedComponentId,
  );
  const activeCompany = usePropelAuthStore((state) => state.activeCompany);

  const { mutate } = useMutation(createCustomComponent, {
    onSettled(_, err) {
      if (err) {
        console.error(err);
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
      type: "",
    },
  });

  const handleSubmitCustomComponent = (values: any) => {
    customComponentModal.close();
    const component = getComponentById(
      editorTree.root,
      selectedComponentId as string,
    );

    const copy = cloneDeep(component) as Component;
    replaceIdsDeeply(copy);

    mutate({
      values: {
        ...values,
        content: encodeSchema(JSON.stringify(copy)) as string,
        type: values.scope === "global" ? values.type : copy?.name,
      },
      projectId: router.query.id as string,
      companyId: activeCompany.orgId,
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
          {customComponentForm.values.scope === "global" && (
            <Select
              withinPortal
              label="Type"
              data={Object.keys(structureMapper)}
              searchable
              dropdownPosition="bottom"
              {...customComponentForm.getInputProps("type")}
            />
          )}
          <Button leftIcon={<IconNewSection size={ICON_SIZE} />} type="submit">
            Save New Component
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
