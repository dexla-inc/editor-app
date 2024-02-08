import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { ActionFormProps, TogglePropsAction } from "@/utils/actions";
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
import { IconTrash } from "@tabler/icons-react";

type Props = ActionFormProps<Omit<TogglePropsAction, "name">>;

type SelectData = Array<{ value: string; label: string }>;

export const TogglePropsActionForm = ({ form }: Props) => {
  const theme = useMantineTheme();
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const component = getComponentById(editorTree.root, selectedComponentId!);

  const conditionOptions =
    component?.name === "Select"
      ? component?.props?.data
      : component?.children?.map((child) => ({
          label: child?.props?.value,
          value: child?.props?.value,
        }));

  return (
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
          variant="default"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </Flex>
      {(form.values.conditionRules ?? []).map(
        ({ componentId, condition }: any, i: number) => {
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
                      Toggle when
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
                  styles={{ label: { width: "100%" } }}
                  {...form.getInputProps(`conditionRules.${i}.condition`)}
                />
              ) : (
                <TextInput
                  size="xs"
                  label="Toggle when"
                  {...form.getInputProps(`conditionRules.${i}.condition`)}
                />
              )}
              <ComponentToBindFromInput
                componentId={component?.id}
                onPickComponent={() => {
                  setPickingComponentToBindTo(undefined);
                  setComponentToBind(undefined);
                }}
                {...form.getInputProps(`conditionRules.${i}.componentId`)}
              />
            </div>
          );
        },
      )}
    </Stack>
  );
};
