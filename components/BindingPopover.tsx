import { CustomJavaScriptTextArea } from "@/components/CustomJavaScriptTextArea";
import { DataTree } from "@/components/DataTree";
import { Icon } from "@/components/Icon";
import { JSONViewer } from "@/components/JSONViewer";
import { useBindingPopover } from "@/hooks/data/useBindingPopover";
import {
  BG_COLOR,
  BINDER_BACKGROUND,
  DEFAULT_TEXTCOLOR,
} from "@/utils/branding";
import { isObjectOrArray } from "@/utils/common";
import { ICON_SIZE } from "@/utils/config";
import { BindingTab, ContextType, ValueProps } from "@/types/dataBinding";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconExternalLink, IconPlugConnected } from "@tabler/icons-react";
import { useState } from "react";
import { useDataBinding } from "@/hooks/data/useDataBinding";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { selectedComponentIdSelector } from "@/utils/componentSelectors";

const TAB_TEXT_SIZE = 11;
const ML = 5;

type Props = {
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  controls: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  style?: "input" | "iconButton";
  isPageAction?: boolean;
};

export default function BindingPopover({
  value,
  onChange,
  controls: { isOpen, onOpen, onClose },
  style = "iconButton",
  isPageAction,
}: Props) {
  const [tab, setTab] = useState<BindingTab>("components");
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const selectedComponentId = useEditorTreeStore(
    (state) => state.selectedComponentIds?.at(-1),
  );
  const { computeValue } = useDataBinding(selectedComponentId);
  const [selectedItem, setSelectedItem] = useState<string>();
  const asideSelectedTab = useEditorStore((state) => state.asideSelectedTab);

  const {
    actions,
    variables,
    components,
    others,
    event,
    getEntityEditorValue,
    item,
  } = useBindingPopover({ isPageAction });
  const onChangeDataTypeAsBoundCode = () => {
    onChange({
      ...value,
      dataType: "boundCode",
    });
    onOpen();
  };

  const onClickUnbind = () => {
    onChange({
      ...value,
      dataType: "static",
    });
    onClose();
  };

  const currentValue = computeValue<string>({ value }, { actions, item });
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
      entity: "others",
      dataItems: Array.of(others),
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

  // testing if item has a key other than "index" only, if it doesnt, it means it is not supposed to be an item component
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
    <Popover
      opened={isOpen}
      withinPortal
      arrowPosition="center"
      position="left-end"
      onClose={onClose}
    >
      <Popover.Target>
        {style === "iconButton" ? (
          <Tooltip label="Bind Logic" withArrow position="top-end">
            <ActionIcon
              onClick={onChangeDataTypeAsBoundCode}
              variant="default"
              tabIndex={-1}
              ml="xs"
            >
              <IconPlugConnected size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <ActionIcon
            onClick={onChangeDataTypeAsBoundCode}
            size="xs"
            tabIndex={-1}
            ml="xs"
          >
            <IconExternalLink size={ICON_SIZE} />
          </ActionIcon>
        )}
      </Popover.Target>
      <Popover.Dropdown
        sx={{
          maxHeight: "98%",
          backgroundColor: BG_COLOR,
          right: "0px !important",
        }}
      >
        <Stack w={500}>
          {/* Pass in the name of the thing that is being bound */}
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="xs">
              <Icon name="IconPlugConnected" color={DEFAULT_TEXTCOLOR} />
              <Title order={5}>Binder</Title>
            </Flex>
            <CloseButton onClick={onClose} />
          </Flex>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="xs">
              <SegmentedControl
                value="JavaScript"
                data={[
                  {
                    value: "Formula",
                    disabled: true,
                    label: (
                      <Center>
                        <Icon name="IconVariable" />
                        <Text ml={ML}>Formula</Text>
                      </Center>
                    ),
                  },
                  {
                    value: "JavaScript",
                    label: (
                      <Center>
                        <Icon name="IconCode" />
                        <Text ml={ML}>JavaScript</Text>
                      </Center>
                    ),
                  },
                ]}
              />
              <Button onClick={onClickUnbind}>Unbind</Button>
            </Flex>
            <ActionIcon variant="light" radius="xl">
              <Icon name="IconCopy" />
            </ActionIcon>
          </Flex>
          <Box>
            <Text size="sm" fw={500} pb={2}>
              {"JavaScript"}
            </Text>
            <CustomJavaScriptTextArea
              language="typescript"
              value={value?.boundCode}
              variables={variables.list}
              components={components.list}
              actions={actions?.list}
              others={others}
              onChange={(code: string) => {
                onChange({ ...value, boundCode: code });
                if (selectedItem) {
                  setSelectedItem(undefined);
                }
              }}
              selectedItem={selectedItem}
            />
          </Box>
          {isObjectOrArray(currentValue) ? (
            <JSONViewer data={currentValue} />
          ) : (
            <TextInput
              label="Current Value"
              styles={{ input: { background: BINDER_BACKGROUND } }}
              value={currentValue ?? "undefined"}
              readOnly
              sx={{
                color: currentValue === undefined ? "grey" : "inherit",
              }}
            />
          )}

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
      </Popover.Dropdown>
    </Popover>
  );
}
