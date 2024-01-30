import { CustomJavaScriptTextArea } from "@/components/CustomJavaScriptTextArea";
import { DataTree } from "@/components/DataTree";
import { Icon } from "@/components/Icon";
import { Category, useBindingPopover } from "@/hooks/useBindingPopover";
import {
  BG_COLOR,
  BINDER_BACKGROUND,
  DEFAULT_TEXTCOLOR,
} from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { BindingTab, BindingType } from "@/utils/types";
import {
  ActionIcon,
  Box,
  Center,
  CloseButton,
  Flex,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconExternalLink, IconPlugConnected } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect, useState } from "react";

const TAB_TEXT_SIZE = "xs";
const ML = 10;

type Props = {
  bindingTab?: BindingTab;
  bindingType: BindingType;
  onChangeBindingType: any;
  onChangeJavascriptCode: any;
  javascriptCode: string;
  bindedValue?: React.InputHTMLAttributes<HTMLInputElement>["value"];
  onPickComponent?: any;
  onPickVariable?: any;
  actionData?: any;
  style?: "input" | "iconButton";
  category?: Category;
};

export default function BindingPopover({
  bindingTab,
  bindingType = "JavaScript",
  onChangeBindingType,
  onChangeJavascriptCode,
  javascriptCode,
  bindedValue,
  onPickComponent,
  onPickVariable,
  actionData,
  style = "iconButton",
  category = "actions",
}: Props) {
  const [formulaEntry, setFormulaEntry] = useState<string>();
  const [currentValue, setCurrentValue] = useState<string>();
  const [newValue, setNewValue] = useState<string>();
  const [tab, setTab] = useState<BindingTab>(bindingTab ?? "components");
  const [filterKeyword, setFilterKeyword] = useState<string>("");

  const {
    variables,
    components,
    browserList,
    handleVariables,
    selectedItem,
    opened,
    toggle: onTogglePopover,
    close: onClosePopover,
    open: onOpenPopover,
    authData,
    handleContext,
    bindableContexts,
  } = useBindingPopover();

  useEffect(() => {
    try {
      if (javascriptCode === "return variables") {
        setNewValue("undefined");
      }

      let newValue = eval(
        `function autoRunJavascriptCode(components, auth) { ${javascriptCode} }` +
          `autoRunJavascriptCode(${bindableContexts
            .map((c) => JSON.stringify(c))
            .join(",")})`,
      );

      const _value = !!newValue ? JSON.stringify(newValue) : "undefined";
      setNewValue(_value);
    } catch {
      setNewValue("undefined");
    }
  }, [javascriptCode, variables, bindableContexts]);

  const openPopover = debounce(() => onOpenPopover && onOpenPopover(), 1000);
  const handleBinder = () => {
    const isSingleAtSign = bindedValue === "@";
    const isDoubleAtSign = bindedValue === "@@";
    if (!isSingleAtSign && !isDoubleAtSign) return;
    setTab(isSingleAtSign ? "components" : "variables");
    openPopover();
  };

  useEffect(
    () => handleBinder(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bindedValue],
  );

  useEffect(() => {
    // If bindingTab prop is provided and differs from the internal state, update it
    if (bindingTab && bindingTab !== tab) {
      setTab(bindingTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bindingTab, tab]);

  const onSetItem = (itemType: BindingTab, item: string) => {
    if (itemType === "components") {
      handleContext("components")({
        item,
        onPick: onPickComponent,
        javascriptCode,
      });
    } else if (itemType === "variables") {
      handleVariables({ item, category, onPickVariable, javascriptCode });
    } else if (itemType === "browser") {
      handleContext("browser")({
        item,
        onPick: onPickVariable,
        javascriptCode,
      });
    } else if (itemType === "actions") {
      handleContext("actions")({
        item,
        onPick: onPickVariable,
        javascriptCode,
      });
    } else if (itemType === "auth") {
      handleContext("auth")({ item, onPick: onPickVariable, javascriptCode });
    }
  };

  return (
    <Popover
      opened={opened}
      withinPortal
      arrowPosition="center"
      position="right"
    >
      <Popover.Target>
        {style === "iconButton" ? (
          <Tooltip label="Bind Logic" withArrow position="top-end">
            <ActionIcon onClick={onTogglePopover} variant="default">
              <IconPlugConnected size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <ActionIcon onClick={onTogglePopover} size="xs">
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
            <CloseButton onClick={onClosePopover} />
          </Flex>
          <Flex justify="space-between" align="center">
            <SegmentedControl
              value={bindingType}
              onChange={onChangeBindingType}
              data={[
                {
                  value: "Formula",
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
            <ActionIcon variant="light" radius="xl">
              <Icon name="IconCopy" />
            </ActionIcon>
          </Flex>
          <Box>
            <Text size="sm" fw={500} pb={2}>
              {bindingType}
            </Text>
            {bindingType === "Formula" ? (
              <Textarea
                styles={{ input: { background: BINDER_BACKGROUND } }}
                value={formulaEntry}
                onChange={(event) => setFormulaEntry(event.currentTarget.value)}
              />
            ) : (
              <CustomJavaScriptTextArea
                language="typescript"
                value={javascriptCode}
                variables={variables.list}
                components={components.list}
                onChange={onChangeJavascriptCode}
                selectedItem={selectedItem}
              />
            )}
          </Box>
          <TextInput
            label="Current Value"
            styles={{ input: { background: BINDER_BACKGROUND } }}
            value={newValue}
            readOnly
            // onChange={(event) => setCurrentValue(event.currentTarget.value)}
            // Color does not change due to a bug which has been fixed in v7
            sx={{
              color: currentValue === undefined ? "grey" : "inherit",
            }}
          />
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
          {tab === "components" ? (
            <DataTree
              filterKeyword={filterKeyword}
              dataItems={Object.values(components?.list)}
              onItemSelection={(item: string) => onSetItem(tab, item)}
              type="components"
            />
          ) : tab === "variables" ? (
            <DataTree
              filterKeyword={filterKeyword}
              dataItems={Object.values(variables.list)}
              onItemSelection={(item: string) => onSetItem(tab, item)}
            />
          ) : tab === "actions" ? (
            <DataTree
              filterKeyword={filterKeyword}
              dataItems={actionData}
              onItemSelection={(item: string) => onSetItem(tab, item)}
              type="actions"
            />
          ) : tab === "auth" ? (
            <DataTree
              filterKeyword={filterKeyword}
              dataItems={authData}
              onItemSelection={(item: string) => onSetItem(tab, item)}
              type="auth"
            />
          ) : tab === "browser" ? (
            // We may get rid of browser and store it in data
            <DataTree
              filterKeyword={filterKeyword}
              dataItems={browserList}
              onItemSelection={(item: string) => onSetItem(tab, item)}
            />
          ) : null}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
