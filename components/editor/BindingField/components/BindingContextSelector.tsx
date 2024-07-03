import {
  Center,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { BindingTab, ContextType } from "@/types/dataBinding";
import { BINDER_BACKGROUND } from "@/utils/branding";
import { Icon } from "@/components/Icon";
import { DataTree } from "@/components/DataTree";
import { useState } from "react";
import { useEditorStore } from "@/stores/editor";
import { useBindingPopover } from "@/hooks/data/useBindingPopover";

const TAB_TEXT_SIZE = 11;
const ML = 5;

export const BindingContextSelector = ({ setSelectedItem }: any) => {
  const [tab, setTab] = useState<BindingTab>("components");
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const asideSelectedTab = useEditorStore((state) => state.asideSelectedTab);
  const {
    actions,
    variables,
    components,
    event,
    getEntityEditorValue,
    others,
    item,
  } = useBindingPopover();

  const segmentedTabOptions = [
    {
      value: "components",
      label: (
        <Center>
          <Icon name="IconComponents" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Components
          </Text>
        </Center>
      ),
    },
    // TODO: Update Variables so Objects and Arrays are supported, like in actions
    {
      value: "variables",
      label: (
        <Center>
          <Icon name="IconVariable" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Variables
          </Text>
        </Center>
      ),
    },
    {
      value: "actions",
      label: (
        <Center>
          <Icon name="IconBolt" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Actions
          </Text>
        </Center>
      ),
    },
    {
      value: "others",
      label: (
        <Center>
          <Icon name="IconWorldWww" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Others
          </Text>
        </Center>
      ),
    },
  ];

  const entitiesDataTreeList: Array<{
    entity: ContextType;
    dataItems: any;
  }> = [
    {
      entity: "item",
      dataItems: Array.of(item),
    },
    {
      entity: "components",
      dataItems: Object.values(components?.list),
    },
    {
      entity: "variables",
      dataItems: Object.values(variables.list),
    },
    {
      entity: "actions",
      dataItems: Object.values(actions?.list ?? []),
    },
    {
      entity: "others",
      dataItems: Array.of(others),
    },
    {
      entity: "event",
      dataItems: event,
    },
  ];

  if (asideSelectedTab === "actions") {
    segmentedTabOptions.unshift({
      value: "event",
      label: (
        <Center>
          <Icon name="IconRouteAltRight" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Event
          </Text>
        </Center>
      ),
    });
  }

  if (Object.keys(item ?? {}).length > 0) {
    segmentedTabOptions.unshift({
      value: "item",
      label: (
        <Center>
          <Icon name="IconRouteAltRight" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Item
          </Text>
        </Center>
      ),
    });
  }

  return (
    <Stack style={{ overflow: "hidden" }}>
      <SegmentedControl
        value={tab}
        onChange={(value) => setTab(value as BindingTab)}
        data={segmentedTabOptions}
      />
      <TextInput
        size="xs"
        styles={{ input: { background: BINDER_BACKGROUND } }}
        placeholder="Search"
        icon={<Icon name="IconSearch" />}
        value={filterKeyword}
        onChange={(event) => setFilterKeyword(event.currentTarget.value)}
      />
      {entitiesDataTreeList
        .filter((entityData) => entityData.entity === tab)
        .map((entityData) => {
          const { entity, dataItems } = entityData;

          return (
            <DataTree
              key={entity}
              filterKeyword={filterKeyword}
              dataItems={dataItems}
              onItemSelection={(selectedEntityId: string) => {
                setSelectedItem(
                  getEntityEditorValue({ selectedEntityId, entity }),
                );
              }}
              type={entity}
            />
          );
        })}
    </Stack>
  );
};
