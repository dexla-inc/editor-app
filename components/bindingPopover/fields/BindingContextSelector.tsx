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
import { useBindingContext } from "@/components/bindingPopover/BindingContextProvider";

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
    browserList,
    auth,
    event,
    getEntityEditorValue,
    item,
  } = useBindingContext();

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
      value: "auth",
      label: (
        <Center>
          <Icon name="IconLogin" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Auth
          </Text>
        </Center>
      ),
    },
    {
      value: "browser",
      label: (
        <Center>
          <Icon name="IconWorldWww" />
          <Text ml={ML} size={TAB_TEXT_SIZE}>
            Browser
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
      entity: "auth",
      dataItems: Array.of(auth),
    },
    {
      entity: "browser",
      dataItems: browserList,
    },
    {
      entity: "actions",
      dataItems: Object.values(actions?.list ?? []),
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

  return (
    <Stack>
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
