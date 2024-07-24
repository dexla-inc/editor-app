import { Icon } from "@/components/Icon";
import { patchPage } from "@/requests/pages/mutations";
import { PageResponse } from "@/requests/pages/types";
import { convertToPatchParams } from "@/types/dashboardTypes";
import { actions, ActionType } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { ActionIcon, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import isEmpty from "lodash.isempty";
import startCase from "lodash.startcase";
import { nanoid } from "nanoid";
import { useEffect } from "react";

type Props = {
  sequentialTo?: string;
  close: () => void;
  page: PageResponse;
  setPage: (page: PageResponse) => void;
};

export const SelectActionForm = ({
  sequentialTo,
  close,
  page,
  setPage,
}: Props) => {
  const sequentialData = [
    { value: "onSuccess", label: "On Success" },
    { value: "onError", label: "On Error" },
  ].filter(
    (t) =>
      !(page.actions ?? []).find((a) =>
        !!sequentialTo
          ? a.trigger === t.value && a.sequentialTo === sequentialTo
          : a.trigger === t.value,
      ),
  );
  const triggers = {
    sequential: sequentialData,
    page: [{ value: "onPageLoad", label: "On Page Load" }],
  };

  const triggerType = !!sequentialTo ? "sequential" : "page";

  const form = useForm({
    initialValues: {
      trigger: triggers[triggerType][0]?.value as any,
      action: {
        name: "" as any,
      } as ActionType,
    },
    validate: {
      action: {
        name: (value: string) => (isEmpty(value) ? "Action is required" : null),
      },
    },
  });

  useEffect(() => {
    const updatePage = async () => {
      if (form.isTouched() && form.isDirty() && form.isValid()) {
        const id = nanoid();
        const updatedActions = (page.actions || [])?.concat({
          id,
          ...form.values,
          ...(!!sequentialTo && { sequentialTo }),
        });

        const patchParams = convertToPatchParams({ actions: updatedActions });
        const result = await patchPage(page.projectId, page.id, patchParams);
        setPage(result);
        form.reset();
        close();
      }
    };

    updatePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values]);

  return (
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
        data={triggers[triggerType]}
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
  );
};
