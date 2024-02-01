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
              onPickComponent={(componentToBind: string) => {
                form.setFieldValue(name, `valueOf_${componentToBind}`);

                setComponentToBind(undefined);
                setPickingComponentToBindTo(undefined);
              }}
              javascriptCode={form.values.actionCode}
              onChangeJavascriptCode={(
                javascriptCode: string,
                label: string,
              ) => {
                const actionCode = form.values.actionCode;
                form.setFieldValue(`actionCode`, {
                  ...actionCode,
                  [label]: javascriptCode,
                });
              }}
              size="xs"
              label={title}
              {...form.getInputProps(name)}
              onChange={(e) => {
                form.setFieldValue(name, e.currentTarget.value);
              }}
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
