import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { OpenToastAction } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { ApiType } from "@/utils/dashboardTypes";
import { Button, Stack } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<OpenToastAction, "name">;

export const OpenToastFlowActionForm = ({ form }: Props) => {
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
              onPickVariable={(variable: string) => {
                form.setFieldValue(name, variable);
              }}
              javascriptCode={form.values.actionCode}
              onChangeJavascriptCode={(javascriptCode: string, label: string) =>
                form.setFieldValue(`actionCode.${label}`, javascriptCode)
              }
              size="xs"
              label={title}
              {...AUTOCOMPLETE_OFF_PROPS}
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
