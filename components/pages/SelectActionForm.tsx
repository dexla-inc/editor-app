import { ActionIcon, Select } from "@mantine/core";
import { Icon } from "@/components/Icon";
import { ICON_SIZE } from "@/utils/config";
import { actions, ActionType } from "@/utils/actions";
import startCase from "lodash.startcase";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import merge from "lodash.merge";
import { PageResponse } from "@/requests/pages/types";

type Props = {
  sequentialTo?: string;
  onUpdatePage: (values: any) => Promise<any>;
  close: () => void;
  page: PageResponse;
};

export const SelectActionForm = ({
  sequentialTo,
  onUpdatePage,
  close,
  page,
}: Props) => {
  const triggers = {
    sequential: [
      { value: "onSuccess", label: "On Success" },
      { value: "onError", label: "On Error" },
    ],
    page: [{ value: "onPageLoad", label: "On Page Load" }],
  };

  const triggerType = !!sequentialTo ? "sequential" : "page";

  const form = useForm({
    initialValues: {
      trigger: triggers[triggerType][0].value as any,
      action: {
        name: "" as any,
      } as ActionType,
    },
  });

  useEffect(() => {
    if (form.isTouched() && form.isDirty()) {
      const id = nanoid();
      const updatedActions = (page.actions || [])?.concat({
        id,
        ...form.values,
        ...(!!sequentialTo && { sequentialTo }),
      });
      const updatedPage = merge({}, page, { actions: updatedActions });

      onUpdatePage(updatedPage).then(() => {
        form.reset();
        close();
      });
    }
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
