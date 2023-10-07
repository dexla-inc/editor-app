import { ComponentToBindInput } from "@/components/ComponentToBindInput";
import { Icon } from "@/components/Icon";
import { useRequestProp } from "@/hooks/useRequestProp";
import { useEditorStore } from "@/stores/editor";
import { useFlowStore } from "@/stores/flow";
import { ChangeStateAction } from "@/utils/actions";
import { decodeSchema } from "@/utils/compression";
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
import cloneDeep from "lodash.clonedeep";
import { useEffect } from "react";

type Props = {
  form: UseFormReturnType<FormValues>;
};

type FormValues = Omit<ChangeStateAction, "name">;

type SelectData = Array<{ value: string; label: string }>;

export const ChangeStateActionFlowForm = ({ form }: Props) => {
  const theme = useMantineTheme();
  const isUpdating = useFlowStore((state) => state.isUpdating);
  const { tree: editorTree, selectedComponentId, setTree } = useEditorStore();

  const { page } = useRequestProp();

  useEffect(() => {
    if (page?.pageState) {
      setTree(JSON.parse(decodeSchema(page.pageState)));
    }
  }, [page?.pageState, setTree]);

  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );
  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );

  const component = getComponentById(editorTree.root, selectedComponentId!);

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
              (form.values.conditionRules ?? []).concat({
                componentId: "",
                condition: "",
                state: "",
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
      {(form.values.conditionRules ?? []).map(
        ({ componentId, condition, state }: any, i: number) => {
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
                    State{" "}
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
                data={[
                  { label: "Default", value: "default" },
                  { label: "Hover", value: "hover" },
                  { label: "Disabled", value: "disabled" },
                  { label: "Checked", value: "checked" },
                  { label: "Hidden", value: "hidden" },
                  ...Object.keys(
                    componentId
                      ? getComponentById(editorTree.root, componentId!)
                          ?.states ?? {}
                      : {},
                  ).reduce((acc, key) => {
                    if (
                      ["hover", "disabled", "checked", "hidden"].includes(key)
                    )
                      return acc;

                    return acc.concat({
                      label: key,
                      value: key,
                    });
                  }, [] as any[]),
                ]}
                placeholder="Select State"
                nothingFound="Nothing found"
                searchable
                value={state}
                styles={{ label: { width: "100%" } }}
              />

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

              {["Radio", "Select"].includes(component!.name) ? (
                <Select
                  size="xs"
                  label="Toggle when"
                  placeholder="Select a condition"
                  data={(conditionOptions as SelectData) ?? []}
                  value={condition}
                  onChange={(val) => onChange(val, "condition", i)}
                />
              ) : (
                <TextInput
                  size="xs"
                  label="Toggle when"
                  value={condition}
                  onChange={(e) => onChange(e.target.value, "condition", i)}
                />
              )}
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
