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
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { Icon } from "@/components/Icon";
import { ComponentToBindInput } from "@/components/ComponentToBindInput";

type Props = {
  id: string;
};

type FormValues = Omit<TogglePropsAction, "name">;

type SelectData = Array<{ value: string; label: string }>;

export const TogglePropsActionForm = ({ id }: Props) => {
  const theme = useMantineTheme();
  const { startLoading, stopLoading } = useLoadingState();
  const { editorTree, selectedComponentId, updateTreeComponentActions } =
    useEditorStores();
  const { componentActions, action } = useActionData<TogglePropsAction>({
    actionId: id,
    editorTree,
    selectedComponentId,
  });
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
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
              form.insertListItem("conditionRules", {
                componentId: "",
                condition: "",
              });
            }}
            color="indigo"
            sx={{ marginRight: 0 }}
            leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
          >
            Add
          </Button>
        </Flex>
        {conditionRules().map(({ componentId, condition }: any, i: number) => {
          return (
            <div
              key={i}
              style={{
                borderBottom: "1px solid " + theme.colors.gray[3],
                paddingBottom: 20,
              }}
            >
              {["Radio", "Select"].includes(component!.name) ? (
                <Select
                  size="xs"
                  label={
                    <Flex justify="space-between" align="center">
                      Toggle when{" "}
                      <ActionIcon
                        onClick={() => {
                          form.removeListItem("conditionRules", i);
                        }}
                      >
                        <IconTrash size={ICON_SIZE} color="red" />
                      </ActionIcon>
                    </Flex>
                  }
                  placeholder="Select a condition"
                  data={(conditionOptions as SelectData) ?? []}
                  value={condition}
                  onChange={(val) => {
                    form.setFieldValue(`conditionRules.${i}.condition`, val);
                  }}
                  styles={{ label: { width: "100%" } }}
                />
              ) : (
                <TextInput
                  size="xs"
                  label="Toggle when"
                  value={condition}
                  onChange={(e) => {
                    form.setFieldValue(
                      `conditionRules.${i}.condition`,
                      e.target.value,
                    );
                  }}
                />
              )}
              <ComponentToBindInput
                index={i}
                value={componentId}
                componentId={component?.id}
                onPick={(componentToBind: string) => {
                  form.setFieldValue(
                    `conditionRules.${i}.componentId`,
                    componentToBind,
                  );

                  setPickingComponentToBindTo(undefined);
                  setComponentToBind(undefined);
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
