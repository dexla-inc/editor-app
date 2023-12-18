import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Icon } from "@/components/Icon";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
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
import { UseFormReturnType } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<TogglePropsAction, "name">;

type SelectData = Array<{ value: string; label: string }>;

export const TogglePropsFlowActionForm = ({ form }: Props) => {
  const theme = useMantineTheme();
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

  const conditionOptions =
    component?.name === "Select"
      ? component?.props?.data ?? component?.props?.exampleData
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
          color="indigo"
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
              <ComponentToBindFromInput
                value={componentId}
                onPickComponent={(componentToBind: string) => {
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
        },
      )}

      <Button type="submit" size="xs" loading={isUpdating}>
        Save
      </Button>
    </Stack>
  );
};
