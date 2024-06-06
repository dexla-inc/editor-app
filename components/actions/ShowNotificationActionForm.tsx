import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { ActionFormProps, ShowNotificationAction } from "@/utils/actions";
import { ApiType } from "@/types/dashboardTypes";
import { Stack } from "@mantine/core";
import React from "react";
import { ThemeColorSelector } from "../ThemeColorSelector";

type Props = ActionFormProps<Omit<ShowNotificationAction, "name">>;

export const ShowNotificationActionForm = ({ form, isPageAction }: Props) => {
  console.log(form.values);
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
