import { CustomJavaScriptTextArea } from "@/components/CustomJavaScriptTextArea";
import { Icon } from "@/components/Icon";
import { ObjectDetails } from "@/components/PropsListing";
import { listVariables } from "@/requests/variables/queries-noauth";
import { useEditorStore } from "@/stores/editor";
import { useInputsStore } from "@/stores/inputs";
import { BG_COLOR, BINDER_BACKGROUND } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { getAllComponentsByName } from "@/utils/editor";
import { getParsedJSCode } from "@/utils/variables";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Popover,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { pick } from "next/dist/lib/pick";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const TAB_TEXT_SIZE = "xs";
const ML = 10;

export type BindingType = "formula" | "js";
export type BindingTab = "components" | "variables" | "datasources" | "browser";

type Props = {
  bindingTab?: BindingTab;
  bindingType: any;
  opened: boolean;
  onTogglePopover: any;
  onClosePopover: any;
  onChangeBindingType: any;
  onChangeJavascriptCode: any;
  javascriptCode: string;
  onOpenPopover?: any;
  bindedValue?: string;
  onPickComponent?: any;
};

export default function BindingPopover({
  bindingTab,
  bindingType,
  opened,
  onTogglePopover,
  onClosePopover,
  onChangeBindingType,
  onChangeJavascriptCode,
  javascriptCode,
  onOpenPopover,
  bindedValue,
  onPickComponent,
}: Props) {
  const editorTree = useEditorStore((state) => state.tree);
  const [formulaEntry, setFormulaEntry] = useState<string>();
  const [currentValue, setCurrentValue] = useState<string>();
  const [selectedItem, setSelectedItem] = useState<string>();
  const [newValue, setNewValue] = useState<string>();
  const [tab, setTab] = useState<BindingTab>(bindingTab ?? "components");
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const theme = useMantineTheme();
  const inputsStore = useInputsStore();

  const browser = useRouter();
  const projectId = browser.query.id as string;
  const pageId = browser.query.page as string;

  const browserList = Object.entries(
    pick(browser, ["asPath", "basePath", "pathname", "query", "route"]),
  ).map(([key, value]) => {
    const isObject = typeof value === "object";
    return {
      id: key,
      name: key,
      value: isObject ? JSON.stringify(value) : value,
      type: isObject ? "OBJECT" : "STRING",
    };
  });

  const { data: variables, isLoading: isVariablesReqLoading } = useQuery({
    queryKey: ["variablesObj", projectId, pageId],
    queryFn: () =>
      listVariables(projectId, { pageId }).then(({ results }) => {
        return results.reduce(
          (acc, variable) => {
            const value = variable.value ?? variable.defaultValue;
            acc.list[variable.id] = variable;
            acc[variable.id] = value ? JSON.parse(value) : value;
            acc[variable.name] = value ? JSON.parse(value) : value;
            return acc;
          },
          { list: {} } as Record<string, any>,
        );
      }),
    enabled: !!projectId && !!pageId,
  });

  const inputComponents = getAllComponentsByName(editorTree.root, [
    "Input",
    "Select",
    "Checkbox",
    "RadioGroup",
    "Switch",
    "Textarea",
  ]).reduce(
    (acc, component) => {
      const value = inputsStore[component?.id!];
      component = { ...component, name: component.description! };
      acc.list[component?.id!] = component;
      acc[component?.id!] = value;
      return acc;
    },
    { list: {} } as Record<string, any>,
  );

  useEffect(() => {
    try {
      if (javascriptCode === "return variables") {
        setNewValue("undefined");
      }

      const parsedCode = getParsedJSCode(javascriptCode);

      let newValue = eval(
        `function autoRunJavascriptCode() { ${parsedCode}}; autoRunJavascriptCode()`,
      );
      setNewValue(JSON.stringify(newValue));
    } catch {
      setNewValue("undefined");
    }
  }, [javascriptCode, variables]);

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

  return (
    <Popover
      opened={opened}
      withinPortal
      position="left-end"
      arrowPosition="center"
    >
      <Popover.Target>
        {onPickComponent ? (
          <ActionIcon onClick={onTogglePopover} size="xs">
            <IconExternalLink size={ICON_SIZE} />
          </ActionIcon>
        ) : (
          <Button size="xs" onClick={onTogglePopover}>
            Binder
          </Button>
        )}
      </Popover.Target>
      <Popover.Dropdown sx={{ maxHeight: "98%", backgroundColor: BG_COLOR }}>
        <Stack w={500}>
          {/* Pass in the name of the thing that is being bound */}
          <Flex justify="space-between" align="center">
            <Title order={5}>Binder</Title>
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
                variables={variables?.list}
                components={inputComponents.list}
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
                value: "datasources",
                label: (
                  <Center>
                    <Icon name="IconDatabase" />
                    <Text ml={ML} size={TAB_TEXT_SIZE}>
                      Data
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
            <Stack>
              <ScrollArea.Autosize mah={300}>
                <ObjectDetails
                  filterKeyword={filterKeyword}
                  variables={Object.values(inputComponents?.list)}
                  onItemSelection={(item: string) => {
                    setSelectedItem(
                      `components[/* ${inputComponents?.list[item].description} */'${item}']`,
                    );
                  }}
                />
              </ScrollArea.Autosize>
            </Stack>
          ) : tab === "variables" ? (
            <Stack>
              <ScrollArea.Autosize mah={300}>
                <ObjectDetails
                  filterKeyword={filterKeyword}
                  variables={Object.values(variables?.list)}
                  onItemSelection={(item: string) => {
                    try {
                      const parsed = JSON.parse(item);
                      const pathStartsWithBracket = parsed.path.startsWith("[")
                        ? ""
                        : ".";
                      setSelectedItem(
                        `variables[/* ${variables?.list[parsed.id].name} */'${
                          parsed.id
                        }']${pathStartsWithBracket}${parsed.path}`,
                      );
                    } catch {
                      setSelectedItem(
                        `variables[/* ${variables?.list[item].name} */'${item}']`,
                      );
                    }
                  }}
                />
              </ScrollArea.Autosize>
            </Stack>
          ) : tab === "datasources" ? (
            <Stack>Create a tree for datasources</Stack>
          ) : tab === "browser" ? (
            <Stack>
              <ScrollArea.Autosize mah={300}>
                <ObjectDetails
                  filterKeyword={filterKeyword}
                  variables={browserList}
                  onItemSelection={(item: string) => {
                    try {
                      const parsed = JSON.parse(item);
                      setSelectedItem(`browser['${parsed.id}'].${parsed.path}`);
                    } catch {
                      setSelectedItem(`browser['${item}']`);
                    }
                  }}
                />
              </ScrollArea.Autosize>
            </Stack>
          ) : null}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
