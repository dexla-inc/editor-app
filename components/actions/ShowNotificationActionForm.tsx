import { ActionFormProps, ShowNotificationAction } from "@/utils/actions";
import { ApiType } from "@/types/dashboardTypes";
import { Stack } from "@mantine/core";
import React from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";
import { BindingField } from "@/components/editor/BindingField/BindingField";

type Props = ActionFormProps<Omit<ShowNotificationAction, "name">>;

export const ShowNotificationActionForm = ({ form, isPageAction }: Props) => {
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
            <BindingField
              fieldType="Text"
              label={title}
              isPageAction={isPageAction}
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
