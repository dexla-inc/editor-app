import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorTreeStore } from "@/stores/editorTree";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import {
  ActionIcon,
  Anchor,
  Flex,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import isEmpty from "lodash.isempty";

type Props = {
  componentName: string;
};

export const StateSelector = ({ componentName }: Props) => {
  const [createState, setCreateState] = useState<undefined | string>(undefined);
  const excludeComponentsForState = ["Text", "Title"];

  const currentState = useEditorTreeStore(
    (state) =>
      state.currentTreeComponentsStates?.[
        state.selectedComponentIds?.at(-1)!
      ] ?? "default",
  );
  const setTreeComponentCurrentState = useEditorTreeStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const onClickResetToDefault = () => {
    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1);
    const component =
      useEditorTreeStore.getState().componentMutableAttrs[selectedComponentId!];

    updateTreeComponentAttrs({
      componentIds: [selectedComponentId!],
      attrs: { props: component?.props },
      forceState: currentState,
    });
  };
  const { getComponentsStates } = useComponentStates();

  const onClickSaveNewState = () => {
    if (isEmpty(createState)) return;

    const selectedComponentId = useEditorTreeStore
      .getState()
      .selectedComponentIds?.at(-1)!;

    setTreeComponentCurrentState(selectedComponentId, createState!);
    updateTreeComponentAttrs({
      componentIds: [selectedComponentId!],
      attrs: { states: { [createState!]: {} } },
      forceState: currentState,
    });
    setCreateState(undefined);
  };

  return (
    !excludeComponentsForState.includes(componentName) && (
      <Stack spacing="xs" px="md">
        {createState === undefined && (
          <Stack>
            <Flex justify="space-between">
              <Text size="xs">State</Text>
              {currentState !== "default" && (
                <Tooltip label="Revert to default settings" position="top-end">
                  <Anchor size="xs" onClick={onClickResetToDefault}>
                    Revert
                  </Anchor>
                </Tooltip>
              )}
            </Flex>
            <Flex gap="xs">
              <Select
                style={{ flex: "1" }}
                value={currentState}
                size="xs"
                data={getComponentsStates()}
                placeholder="Select State"
                nothingFound="Nothing found"
                searchable
                onChange={(value: string) => {
                  const selectedComponentId = useEditorTreeStore
                    .getState()
                    .selectedComponentIds?.at(-1)!;
                  setTreeComponentCurrentState(selectedComponentId, value);
                }}
                {...AUTOCOMPLETE_OFF_PROPS}
              />
              <ActionIconDefault
                iconName="IconPlus"
                tooltip="Create new state"
                onClick={() => {
                  setCreateState("");
                }}
              />
            </Flex>
          </Stack>
        )}
        {createState !== undefined && (
          <form onSubmit={onClickSaveNewState}>
            <Flex gap="10px" align="flex-end">
              <TextInput
                style={{ flex: "1" }}
                size="xs"
                label="State Name"
                placeholder="My New State"
                value={createState}
                required
                withAsterisk
                onChange={(event) => {
                  setCreateState(event.currentTarget.value);
                }}
              />
              <Tooltip label={`Cancel`}>
                <ActionIcon
                  variant="default"
                  size="1.875rem"
                  type="button"
                  onClick={() => setCreateState(undefined)}
                >
                  <IconX size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={`Save new state`}>
                <ActionIcon
                  color="teal"
                  variant="filled"
                  size="1.875rem"
                  type="submit"
                >
                  <IconCheck size="1rem" />
                </ActionIcon>
              </Tooltip>
            </Flex>
          </form>
        )}
      </Stack>
    )
  );
};
