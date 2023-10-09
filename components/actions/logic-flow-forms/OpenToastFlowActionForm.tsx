import { useFlowStore } from "@/stores/flow";
import { OpenToastAction } from "@/utils/actions";
import { Button, Stack, Title } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { ApiType } from "@/utils/dashboardTypes";
import React from "react";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<OpenToastAction, "name">;

export const OpenToastFlowActionForm = ({ form }: Props) => {
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
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
            <Title order={5} mt="md">
              {title}
            </Title>
            <ComponentToBindFromInput
              onPickComponent={(componentToBind: string) => {
                form.setValues({
                  ...form.values,
                  [name]: `valueOf_${componentToBind}`,
                });
                setComponentToBind(undefined);
              }}
              onPickVariable={(variable: string) => {
                form.setValues({
                  ...form.values,
                  [name]: variable,
                });
                setComponentToBind(undefined);
              }}
              size="xs"
              label={title}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
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
