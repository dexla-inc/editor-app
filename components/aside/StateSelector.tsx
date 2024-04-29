import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useComponentStates } from "@/hooks/editor/useComponentStates";
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
import {
  selectedComponentIdSelector,
  selectedComponentIdsSelector,
} from "@/utils/componentSelectors";

type Props = {
  componentName: string;
};

export const StateSelector = ({ componentName }: Props) => {
  const [createState, setCreateState] = useState<undefined | string>(undefined);
  const excludeComponentsForState = ["Text", "Title"];

  const currentState = useEditorTreeStore((state) => {
    const selectedComponentId = selectedComponentIdSelector(state);
    return (
      state.currentTreeComponentsStates?.[selectedComponentId!] ?? "default"
    );
  });
  const setTreeComponentCurrentState = useEditorTreeStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const resetComponentsState = useEditorTreeStore(
    (state) => state.resetComponentsState,
  );

  const onClickResetToDefault = () => {
    const selectedComponentIds = selectedComponentIdsSelector(
      useEditorTreeStore.getState(),
    );

    resetComponentsState(selectedComponentIds, currentState);
  };
  const { getComponentsStates } = useComponentStates();

  const onClickSaveNewState = async () => {
    if (isEmpty(createState)) return;

    const selectedComponentId = selectedComponentIdSelector(
      useEditorTreeStore.getState(),
    )!;

    setCreateState(undefined);

    await Promise.all([
      setTreeComponentCurrentState(selectedComponentId, createState!),
      updateTreeComponentAttrs({
        componentIds: [selectedComponentId!],
        attrs: { states: { [createState!]: {} } },
        forceState: currentState,
      }),
    ]);
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
                  const selectedComponentId = selectedComponentIdSelector(
                    useEditorTreeStore.getState(),
                  )!;
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
