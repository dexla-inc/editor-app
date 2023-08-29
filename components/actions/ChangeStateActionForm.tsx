import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, ChangeStateAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";

type Props = {
  id: string;
};

type FormValues = {
  componentId?: string;
  state?: string;
};

export const ChangeStateActionForm = ({ id }: Props) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo
  );
  const editorTree = useEditorStore((state) => state.tree);
  const componentToBind = useEditorStore((state) => state.componentToBind);
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind
  );
  const pickingComponentToBindTo = useEditorStore(
    (state) => state.pickingComponentToBindTo
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.id === id
  ) as Action;
  const changeStateAction = action.action as ChangeStateAction;

  const form = useForm<FormValues>({
    initialValues: {
      componentId: changeStateAction.componentId,
      state: changeStateAction.state,
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      startLoading({
        id: "saving-action",
        title: "Saving Action",
        message: "Wait while we save your changes",
      });

      updateTreeComponentActions(
        selectedComponentId!,
        componentActions.map((action: Action) => {
          if (action.id === id) {
            return {
              ...action,
              action: {
                ...action.action,
                componentId: values.componentId ?? "",
                state: values.state ?? "default",
              },
            };
          }

          return action;
        })
      );

      stopLoading({
        id: "saving-action",
        title: "Action Saved",
        message: "Your changes were saved successfully",
      });
    } catch (error) {
      stopLoading({
        id: "saving-action",
        title: "Failed",
        message: "Oops, something went wrong while saving your changes",
        isError: true,
      });
    }
  };

  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== action.id;
      })
    );
  };

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      if (pickingComponentToBindTo.componentId === component?.id) {
        form.setFieldValue("componentId", componentToBind);

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component?.id, componentToBind, pickingComponentToBindTo]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <TextInput
          key={form.values.componentId}
          size="xs"
          label="Component to bind"
          {...form.getInputProps("componentId")}
          rightSection={
            <ActionIcon
              onClick={() => {
                setPickingComponentToBindTo({
                  componentId: component?.id!,
                  trigger: action.trigger,
                  bindedId: changeStateAction?.componentId ?? "",
                });
              }}
            >
              <IconCurrentLocation size={ICON_SIZE} />
            </ActionIcon>
          }
        />
        <Select
          size="xs"
          label="State"
          data={[
            { label: "Default", value: "default" },
            { label: "Hover", value: "hover" },
            { label: "Disabled", value: "disabled" },
            ...Object.keys(
              form.values.componentId
                ? getComponentById(editorTree.root, form.values.componentId!)
                    ?.states ?? {}
                : {}
            ).reduce((acc, key) => {
              if (key === "hover" || "disabled") return acc;

              return acc.concat({
                label: key,
                value: key,
              });
            }, [] as any[]),
          ]}
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
          {...form.getInputProps("state")}
        />

        <Button size="xs" type="submit" mt="xs">
          Save
        </Button>
        <Button
          size="xs"
          type="button"
          variant="default"
          onClick={removeAction}
          color="red"
        >
          Remove
        </Button>
      </Stack>
    </form>
  );
};
