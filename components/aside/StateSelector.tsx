import { ActionIconDefault } from "@/components/ActionIconDefault";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
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

type Props = {
  componentName: string;
};

export const StateSelector = ({ componentName }: Props) => {
  const [createState, setCreateState] = useState<undefined | string>(undefined);
  const excludeComponentsForState = ["Text", "Title"];

  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  ) as string;
  const component = useEditorStore(
    (state) => state.componentMutableAttrs[selectedComponentId!],
  );

  const currentState = useEditorStore(
    (state) =>
      state.currentTreeComponentsStates?.[selectedComponentId!] ?? "default",
  );
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );

  const onClickResetToDefault = () => {
    updateTreeComponentAttrs({
      componentIds: [selectedComponentId!],
      attrs: { props: component?.props },
      forceState: currentState,
    });
  };
  const { getComponentsStates } = useComponentStates();

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
          <Flex gap="10px" align="flex-end">
            <TextInput
              style={{ flex: "1" }}
              size="xs"
              label="State Name"
              placeholder="My New State"
              value={createState}
              onChange={(event) => {
                setCreateState(event.currentTarget.value);
              }}
            />
            <Tooltip label={`Cancel`}>
              <ActionIcon
                variant="default"
                size="1.875rem"
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
                onClick={() => {
                  setTreeComponentCurrentState(
                    selectedComponentId,
                    createState,
                  );
                  updateTreeComponentAttrs({
                    componentIds: [selectedComponentId],
                    attrs: { props: {} },
                    save: true,
                  });
                  setCreateState(undefined);
                }}
              >
                <IconCheck size="1rem" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        )}
      </Stack>
    )
  );
};
