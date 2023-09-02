import { useAppStore } from "@/stores/app";
import { useEditorStore } from "@/stores/editor";
import { Action, ChangeStateAction, TogglePropsAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import { ActionIcon, Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect } from "react";

type Props = {
  id: string;
};

type FormValues = {
  componentId?: string;
  state?: string;
};

export const TogglePropsActionForm = ({ id }: Props) => {
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

  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);

  const component = getComponentById(editorTree.root, selectedComponentId!);
  const componentActions = component?.actions ?? [];
  const action: Action = componentActions.find(
    (a: Action) => a.id === id
  ) as Action;

  const [copied, { open, close }] = useDisclosure(false);

  const filteredComponentActions = componentActions.filter((a: Action) => {
    return a.id === action.id || a.sequentialTo === action.id;
  });

  const togglePropsAction = action.action as TogglePropsAction;

  const form = useForm<FormValues>({
    initialValues: {
      componentId: togglePropsAction.componentId,
      state: togglePropsAction.props,
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
                props: values.state ?? "hidden",
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

  const copyAction = () => {
    setCopiedAction(filteredComponentActions);
    open();
  };

  useEffect(() => {
    const timeout = setTimeout(() => copied && close(), 2000);
    return () => clearTimeout(timeout);
  });

  const removeAction = () => {
    updateTreeComponentActions(
      selectedComponentId!,
      componentActions.filter((a: Action) => {
        return a.id !== action.id && a.sequentialTo !== action.id;
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
                  bindedId: togglePropsAction?.componentId ?? "",
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
            { label: "Toggle", value: "toggle" },
            { label: "Visible", value: "visible" },
            { label: "Hidden", value: "hidden" },
          ]}
          placeholder="Select State"
          nothingFound="Nothing found"
          searchable
        />

        <Button size="xs" type="submit" mt="xs">
          Save
        </Button>
        <Button
          size="xs"
          type="button"
          variant="light"
          color="pink"
          onClick={copyAction}
        >
          {copied ? "Copied" : "Copy"}
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
