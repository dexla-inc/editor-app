import { CustomJavaScriptTextArea } from "@/components/CustomJavaScriptTextArea";
import { Icon } from "@/components/Icon";
import {
  ActionIcon,
  Box,
  Center,
  Flex,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";

const TAB_TEXT_SIZE = "xs";
const ML = 10;

export type BindingType = "formula" | "js";
export type BindingTab = "components" | "variables" | "datasources" | "browser";

type FormulaLabel = "Formula" | "JavaScript";

type Props = {
  bindingTab?: BindingTab;
  bindingType?: BindingType;
  opened: boolean;
};

export default function BindingPopover({
  bindingTab,
  bindingType,
  opened,
}: Props) {
  const [type, setType] = useState<BindingType>(bindingType ?? "formula");
  const [formulaLabel, setFormulaLabel] = useState<FormulaLabel>("Formula");
  const [formulaEntry, setFormulaEntry] = useState<string>();
  const [currentValue, setCurrentValue] = useState<string>();
  const [tab, setTab] = useState<BindingTab>(bindingTab ?? "components");
  const theme = useMantineTheme();

  useEffect(() => {
    if (type === "formula") {
      setFormulaLabel("Formula");
    } else if (type === "js") {
      setFormulaLabel("JavaScript");
    }
  }, [type]);

  return (
    <Popover opened={opened}>
      <Popover.Target>
        <Stack
          w={500}
          bg={"#fff"}
          p="md"
          sx={{
            border: "1px solid " + theme.colors.gray[3],
            borderRadius: theme.radius.md,
          }}
        >
          {/* Pass in the name of the thing that us being bound */}
          <Title order={5}>Binder</Title>
          <Flex justify="space-between" align="center">
            <SegmentedControl
              value={type}
              onChange={(value) => setType(value as BindingType)}
              data={[
                {
                  value: "formula",
                  label: (
                    <Center>
                      <Icon name="IconVariable" />
                      <Text ml={ML}>Formula</Text>
                    </Center>
                  ),
                },
                {
                  value: "js",
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
          </Flex>{" "}
          <Box>
            <Text size="sm" fw={500} pb={2}>
              {formulaLabel}
            </Text>
            {type === "formula" ? (
              <Textarea
                value={formulaEntry}
                onChange={(event) => setFormulaEntry(event.currentTarget.value)}
              />
            ) : (
              <CustomJavaScriptTextArea
                language="typescript"
                value={formulaEntry}
              />
            )}
          </Box>
          <TextInput
            label="Current Value"
            value={currentValue === undefined ? "undefined" : currentValue}
            onChange={(event) => setCurrentValue(event.currentTarget.value)}
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
            placeholder="Search"
            icon={<Icon name="IconSearch" />}
          />
          {tab === "components" ? (
            <Stack>Create a tree for the components</Stack>
          ) : tab === "variables" ? (
            <Stack>Create a tree for variables</Stack>
          ) : tab === "datasources" ? (
            <Stack>Create a tree for datasources</Stack>
          ) : tab === "browser" ? (
            <Stack>
              Create a tree for browser info like path, domain, query, etc.
            </Stack>
          ) : null}
        </Stack>
      </Popover.Target>
    </Popover>
  );
}
