import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useEditorStores,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useEditorStore } from "@/stores/editor";
import { TogglePropsAction } from "@/utils/actions";
import { ICON_SIZE } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import {
  ActionIcon,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrentLocation } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { ComponentToBindActionsPopover } from "@/components/ComponentToBindActionsPopover";

type Props = {
  id: string;
};

type FormValues = Omit<TogglePropsAction, "name">;

type SelectData = Array<{ value: string; label: string }>;

export const TogglePropsActionForm = ({ id }: Props) => {
  const [componentToBindIndex, setComponentToBindIndex] = useState<number>();

  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<TogglePropsAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const {
    setPickingComponentToBindTo,
    componentToBind,
    setComponentToBind,
    pickingComponentToBindTo,
  } = useEditorStore();
  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      conditionRules: action.action.conditionRules ?? [],
    },
  });

  const conditionRules = () => form.getInputProps("conditionRules").value;

  const onSubmit = (values: FormValues) => {
    handleLoadingStart({ startLoading });

    try {
      updateActionInTree<TogglePropsAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          conditionRules: values.conditionRules ?? [],
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  useEffect(() => {
    if (componentToBind && pickingComponentToBindTo) {
      if (pickingComponentToBindTo.componentId === component?.id) {
        const newValue = conditionRules();
        newValue[componentToBindIndex ?? 0].componentId = componentToBind;

        form.setFieldValue("conditionRules", newValue);

        setPickingComponentToBindTo(undefined);
        setComponentToBind(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    component?.id,
    componentToBind,
    pickingComponentToBindTo,
    componentToBindIndex,
  ]);

  const conditionOptions =
    component?.name === "Select"
      ? component?.props?.data
      : component?.children?.map((child) => child.props);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Flex justify="space-between" gap="xl" sx={{ marginTop: "0.5rem" }}>
          <Text fz="xs" weight="500">
            Condition Rules
          </Text>

          <Button
            type="button"
            compact
            onClick={() => {
              form.setFieldValue(
                "conditionRules",
                conditionRules().concat({
                  componentId: "",
                  condition: "",
                }),
              );
            }}
            color="indigo"
            sx={{ marginRight: 0 }}
            leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
          >
            Add
          </Button>
        </Flex>
        {form
          .getInputProps("conditionRules")
          .value.map(({ componentId, condition }: any, i: number) => {
            return (
              <div key={i}>
                {["Radio", "Select"].includes(component!.name) ? (
                  <Select
                    size="xs"
                    label="Toggle when"
                    placeholder="Select a condition"
                    data={(conditionOptions as SelectData) ?? []}
                    value={condition}
                    onChange={(val) => {
                      const newValue = conditionRules();
                      newValue[i].condition = val;
                      form.setFieldValue("conditionRules", newValue);
                    }}
                  />
                ) : (
                  <TextInput
                    size="xs"
                    label="Toggle when"
                    value={condition}
                    onChange={(e) => {
                      const newValue = conditionRules();
                      newValue[i].condition = e.target.value;
                      form.setFieldValue("conditionRules", newValue);
                    }}
                  />
                )}
                <TextInput
                  size="xs"
                  label="Component to bind"
                  onChange={(e) => {
                    const newValue = conditionRules();
                    newValue[i].componentId = e.target.value;
                    form.setFieldValue("conditionRules", newValue);
                  }}
                  value={componentId}
                  rightSection={
                    <>
                      <ComponentToBindActionsPopover
                        onClick={(componentToBind: string) => {
                          const newValue = conditionRules();
                          newValue[i].componentId = componentToBind;

                          form.setFieldValue("conditionRules", newValue);
                        }}
                      />
                      <ActionIcon
                        onClick={() => {
                          setComponentToBindIndex(i);
                          setPickingComponentToBindTo({
                            componentId: component?.id!,
                            trigger: action.trigger,
                            bindedId: componentId ?? "",
                          });
                        }}
                      >
                        <IconCurrentLocation size={ICON_SIZE} />
                      </ActionIcon>
                    </>
                  }
                  styles={{
                    input: { paddingRight: "3.65rem" },
                    rightSection: { width: "3.65rem" },
                  }}
                />
              </div>
            );
          })}

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
          selectedComponentId={selectedComponentId}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
