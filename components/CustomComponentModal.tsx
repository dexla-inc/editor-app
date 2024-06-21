import { upsertCustomComponent } from "@/requests/components/mutations";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { structureMapper } from "@/utils/componentMapper";
import { encodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import {
  EditorTreeCopy,
  getComponentTreeById,
  replaceIdsDeeply,
} from "@/utils/editor";
import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconNewSection } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import merge from "lodash.merge";
import { useUserConfigStore } from "@/stores/userConfig";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";
import { useEditorParams } from "@/hooks/editor/useEditorParams";

type Props = {
  isCustomComponentModalOpen: boolean;
};

export const CustomComponentModal = ({ isCustomComponentModalOpen }: Props) => {
  const { id: projectId } = useEditorParams();
  const queryClient = useQueryClient();
  const setIsCustomComponentModalOpen = useUserConfigStore(
    (state) => state.setIsCustomComponentModalOpen,
  );

  const activeCompany = usePropelAuthStore((state) => state.activeCompany);

  const { mutate } = useMutation({
    mutationFn: upsertCustomComponent,
    ...{
      onSettled: async (_, err) => {
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
          queryClient.invalidateQueries({ queryKey: ["components"] });
        }

        await setIsCustomComponentModalOpen(false);
      },
    },
  });

  const customComponentForm = useForm({
    initialValues: {
      name: "",
      scope: "project",
      type: "",
    },
  });

  const handleSubmitCustomComponent = async (values: any) => {
    const editorTree = useEditorTreeStore.getState().tree;
    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    );

    const componentTree = getComponentTreeById(
      editorTree.root,
      selectedComponentId as string,
    );
    const component =
      useEditorTreeStore.getState().componentMutableAttrs[selectedComponentId!];

    const copy = merge({}, component, componentTree);
    replaceIdsDeeply(copy as EditorTreeCopy);

    mutate({
      values: {
        ...values,
        id: selectedComponentId,
        content: encodeSchema(JSON.stringify(copy)) as string,
        type: values.scope === "global" ? values.type : copy?.name,
      },
      projectId: projectId as string,
      companyId: activeCompany.orgId,
    });
  };

  return (
    <Modal
      centered
      title="New Custom Component"
      onClose={() => setIsCustomComponentModalOpen(false)}
      opened={isCustomComponentModalOpen}
      zIndex={300}
    >
      <form
        onSubmit={customComponentForm.onSubmit(handleSubmitCustomComponent)}
      >
        <Stack>
          <TextInput
            data-autofocus
            label="Name"
            withAsterisk={false}
            {...customComponentForm.getInputProps("name")}
            {...AUTOCOMPLETE_OFF_PROPS}
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
          <Button
            leftIcon={<IconNewSection size={ICON_SIZE} />}
            type="submit"
            mt="md"
          >
            Save New Component
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};
