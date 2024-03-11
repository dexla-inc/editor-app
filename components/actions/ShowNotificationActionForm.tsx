import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, ShowNotificationAction } from "@/utils/actions";
import { ApiType } from "@/utils/dashboardTypes";
import { Stack } from "@mantine/core";
import React from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

type Props = ActionFormProps<Omit<ShowNotificationAction, "name">>;

export const ShowNotificationActionForm = ({ form }: Props) => {
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  return (
    <Stack spacing={2}>
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
              label={title}
              onPickComponent={() => {
                setPickingComponentToBindTo(undefined);
                setComponentToBind(undefined);
              }}
              {...form.getInputProps(name)}
            />
          </React.Fragment>
        );
      })}
      <ThemeColorSelector
        label="Color"
        {...form.getInputProps("color")}
        onChange={(value: string) => {
          form.setFieldValue("color", value);
        }}
        excludeTransparent
      />
    </Stack>
  );
};
