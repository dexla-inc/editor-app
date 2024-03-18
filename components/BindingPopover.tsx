import { CustomJavaScriptTextArea } from "@/components/CustomJavaScriptTextArea";
import { DataTree } from "@/components/DataTree";
import { Icon } from "@/components/Icon";
import { JSONViewer } from "@/components/JSONViewer";
import { useDataContext } from "@/contexts/DataProvider";
import { useBindingPopover } from "@/hooks/useBindingPopover";
import {
  BG_COLOR,
  BINDER_BACKGROUND,
  DEFAULT_TEXTCOLOR,
} from "@/utils/branding";
import { isObjectOrArray } from "@/utils/common";
import { ICON_SIZE } from "@/utils/config";
import { BindingTab, ValueProps } from "@/utils/types";
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
import { useEffect, useState } from "react";

const TAB_TEXT_SIZE = "xs";
const ML = 10;

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
  const { variables, components, browserList, auth, computeValue } =
    useDataContext()!;
  const [selectedItem, setSelectedItem] = useState<string>();

  const { actions, getEntityEditorValue } = useBindingPopover({ isPageAction });

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

  useEffect(
    () => {
      const isSingleAtSign = value?.boundCode === "@";
      const isDoubleAtSign = value?.boundCode === "@@";
      if (!isSingleAtSign && !isDoubleAtSign) return;
      setTab(isSingleAtSign ? "components" : "variables");
      onOpen();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value?.boundCode],
  );

  const currentValue = computeValue({ value });

  const entitiesDataTreeList: Array<{
    entity: "auth" | "components" | "browser" | "variables" | "actions";
    dataItems: any;
  }> = [
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
      dataItems: actions?.list ? Object.values(actions?.list) : [],
    },
  ];

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
            >
              <IconPlugConnected size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <ActionIcon
            onClick={onChangeDataTypeAsBoundCode}
            size="xs"
            tabIndex={-1}
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
              onChange={(code: string) =>
                onChange({ ...value, boundCode: code })
              }
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
            data={[
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
            ]}
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
