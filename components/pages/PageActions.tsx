import { ActionIcon, Button, Select, Stack, Text } from "@mantine/core";
import startCase from "lodash.startcase";
import { Action, actionMapper, actions } from "@/utils/actions";
import { useForm } from "@mantine/form";
import { PageResponse } from "@/requests/pages/types";
import { ActionSettingsForm } from "@/components/pages/ActionSettingsForm";
import { useEffect } from "react";
import { updatePage } from "@/requests/pages/mutations";
import { useEditorStore } from "@/stores/editor";
import merge from "lodash.merge";
import { nanoid } from "nanoid";
import { SidebarSection } from "@/components/pages/SidebarSection";
import { IconBolt } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Icon } from "@/components/Icon";
import { ICON_SIZE } from "@/utils/config";

type Props = {
  page?: PageResponse | null | undefined;
  invalidateQuery: () => void;
};

export default function PageActions({ page, invalidateQuery }: Props) {
  const projectId = useEditorStore((state) => state.currentProjectId!);
  const pageId = useEditorStore((state) => state.currentPageId!);
  const [addForm, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      trigger: "onPageLoad",
      action: {
        name: "",
      },
    },
  });

  useEffect(() => {
    if (form.isTouched() && form.isDirty()) {
      const id = nanoid();
      const values = merge(page, {
        actions: [
          {
            id,
            ...form.values,
          },
        ],
      });
      updatePage(values, projectId, pageId).then(() => {
        invalidateQuery();
        form.reset();
        close();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  const removeAction = (id: string) => {
    if (page) {
      const updatedActions =
        page.actions?.filter(
          (a: Action) => a.id !== id && a.sequentialTo !== id,
        ) ?? [];

      updatePage({ ...page, actions: updatedActions }, projectId, pageId);
    }
  };

  return (
    <Stack>
      {!addForm && (
        <Button
          onClick={open}
          size="xs"
          type="button"
          variant="light"
          w={"100%"}
        >
          Add Action
        </Button>
      )}
      {addForm && (
        <>
          <ActionIcon
            onClick={close}
            color="gray"
            variant="light"
            radius="xl"
            size="sm"
            sx={{ position: "absolute", top: "-5px", right: "0px", zIndex: 30 }}
          >
            <Icon name="IconX" size={ICON_SIZE} />
          </ActionIcon>
          <Select
            size="xs"
            placeholder="Select a trigger"
            label="Trigger"
            data={[{ value: "onPageLoad", label: "On Page Load" }]}
            {...form.getInputProps("trigger")}
          />
          <Select
            size="xs"
            placeholder="Select an action"
            label="Action"
            searchable
            nothingFound="No actions found"
            data={actions.map((action) => {
              return {
                label: startCase(action.name),
                value: action.name,
                group: action.group,
              };
            })}
            {...form.getInputProps("action.name")}
          />
        </>
      )}

      {page?.actions?.map((action) => {
        const actionMapped = actionMapper[action?.action?.name];

        return (
          <SidebarSection
            key={action.id}
            id={action.id}
            isAction
            icon={IconBolt}
            removeAction={removeAction}
            label={`${startCase(action.trigger)}: ${startCase(
              action.action.name,
            )}`}
          >
            <ActionSettingsForm
              action={action}
              pageActions={page?.actions || []}
              defaultValues={actionMapped.defaultValues}
            >
              {({ form }) => {
                const ActionForm = actionMapped.form;
                return <ActionForm form={form} />;
              }}
            </ActionSettingsForm>
          </SidebarSection>
        );
      })}
    </Stack>
  );
}
