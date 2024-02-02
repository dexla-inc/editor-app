import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ShowNotificationAction } from "@/utils/actions";
import { ApiType } from "@/utils/dashboardTypes";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ShowNotificationAction, "name">;

export const ShowNotificationFlowActionForm = ({ form }: Props) => {
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const isUpdating = useFlowStore((state) => state.isUpdating);

  return (
    <Stack>
      {[
        {
          title: "Title",
          name: "title" as ApiType,
        },
        {
          title: "Message",
          name: "message" as ApiType,
        },
      ].map(({ title, name }) => {
        return (
          <React.Fragment key={title}>
            <ComponentToBindFromInput
              isLogicFlow={true}
              onPickComponent={() => {
                setComponentToBind(undefined);
                setPickingComponentToBindTo(undefined);
              }}
              size="xs"
              label={title}
              {...form.getInputProps(name)}
            />
          </React.Fragment>
        );
      })}
      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
