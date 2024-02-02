import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Icon } from "@/components/Icon";
import { ActionButtons } from "@/components/actions/ActionButtons";
import {
  handleLoadingStart,
  handleLoadingStop,
  updateActionInTree,
  useActionData,
  useLoadingState,
} from "@/components/actions/_BaseActionFunctions";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
import { ChangeStateAction } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
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
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import cloneDeep from "lodash.clonedeep";
import { ValueProps } from "@/utils/types";

type Props = {
  id: string;
};

type FormValues = Omit<ChangeStateAction, "name">;

type SelectData = Array<{ value: string; label: string }>;

export const ChangeStateActionForm = ({ id }: Props) => {
  const theme = useMantineTheme();

  const { startLoading, stopLoading } = useLoadingState();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const { componentActions, action } = useActionData<ChangeStateAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const { getComponentsStates } = useComponentStates();

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const form = useForm<FormValues>({
    initialValues: {
      conditionRules: action.action?.conditionRules ?? [],
      actionCode: action.action?.actionCode ?? {},
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      handleLoadingStart({ startLoading });

      updateActionInTree<ChangeStateAction>({
        selectedComponentId: selectedComponentId!,
        componentActions,
        id,
        updateValues: {
          conditionRules: values.conditionRules ?? [],
          actionCode: values.actionCode,
        },
        updateTreeComponentActions,
      });

      handleLoadingStop({ stopLoading });
    } catch (error) {
      handleLoadingStop({ stopLoading, success: false });
    }
  };

  const onChange = (val: string | null, key: string, i: number) => {
    const newValue = cloneDeep(form.values.conditionRules) as any;
    newValue[i][key] = val;
    form.setFieldValue("conditionRules", newValue);
  };

  const conditionOptions =
    component?.name === "Select"
      ? component?.props?.data ?? component?.props?.exampleData
      : component?.children?.map((child) => ({
          label: child?.props?.value,
          value: child?.props?.value,
        }));

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
                form.values.conditionRules.concat({
                  componentId: {} as ValueProps,
                  condition: "",
                  state: "",
                }),
              );
            }}
            variant="default"
            sx={{ marginRight: 0 }}
            leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
          >
            Add
          </Button>
        </Flex>
        {form.values.conditionRules.map(
          ({ condition, state }: any, i: number) => {
            return (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid " + theme.colors.gray[3],
                  paddingBottom: 10,
                }}
              >
                <Select
                  size="xs"
                  label={
                    <Flex justify="space-between" align="center">
                      State
                      <ActionIcon
                        onClick={() => {
                          form.removeListItem("conditionRules", i);
                        }}
                      >
                        <IconTrash size={ICON_SIZE} color="red" />
                      </ActionIcon>
                    </Flex>
                  }
                  onChange={(val) => onChange(val, "state", i)}
                  data={getComponentsStates()}
                  placeholder="Select State"
                  nothingFound="Nothing found"
                  searchable
                  value={state}
                  styles={{ label: { width: "100%" } }}
                  {...AUTOCOMPLETE_OFF_PROPS}
                />

                <ComponentToBindFromInput
                  componentId={component?.id}
                  onPickComponent={() => {
                    setPickingComponentToBindTo(undefined);
                    setComponentToBind(undefined);
                  }}
                  {...form.getInputProps(`conditionRules.${i}.componentId`)}
                />

                {["Radio", "Select"].includes(component!.name) ? (
                  <Select
                    size="xs"
                    label="Toggle when"
                    placeholder="Select a condition"
                    data={(conditionOptions as SelectData) ?? []}
                    {...form.getInputProps(`conditionRules.${i}.condition`)}
                  />
                ) : (
                  <TextInput
                    size="xs"
                    label="Toggle when"
                    {...form.getInputProps(`conditionRules.${i}.condition`)}
                  />
                )}
              </div>
            );
          },
        )}

        <ActionButtons
          actionId={action.id}
          componentActions={componentActions}
        ></ActionButtons>
      </Stack>
    </form>
  );
};
