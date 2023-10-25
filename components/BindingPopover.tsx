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
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listVariables } from "@/requests/variables/queries";
import { useRouter } from "next/router";

const TAB_TEXT_SIZE = "xs";
const ML = 10;

export type BindingType = "formula" | "js";
export type BindingTab = "components" | "variables" | "datasources" | "browser";

type Props = {
  bindingTab?: BindingTab;
  bindingType: any;
  opened: boolean;
  onTogglePopover: any;
  onChangeBindingType: any;
  onChangeJavascriptCode: any;
  javascriptCode: string;
};

export default function BindingPopover({
  bindingTab,
  bindingType,
  opened,
  onTogglePopover,
  onChangeBindingType,
  onChangeJavascriptCode,
  javascriptCode,
}: Props) {
  const [formulaEntry, setFormulaEntry] = useState<string>();
  const [currentValue, setCurrentValue] = useState<string>();
  const [newValue, setNewValue] = useState<string>();
  const [tab, setTab] = useState<BindingTab>(bindingTab ?? "components");
  const theme = useMantineTheme();

  const router = useRouter();
  const projectId = router.query.id as string;
  const pageId = router.query.page as string;

  const { data: variables } = useQuery({
    queryKey: ["variablesObj", projectId, pageId],
    queryFn: () =>
      listVariables(projectId, { pageId }).then(({ results }) => {
        return results.reduce(
          (acc, variable) => {
            acc.list[variable.id] = variable;
            acc[variable.id] = variable.value ?? variable.defaultValue;
            return acc;
          },
          { list: {} } as Record<string, any>,
        );
      }),
    enabled: !!projectId && !!pageId,
  });

  useEffect(() => {
    try {
      if (javascriptCode === "return variables") {
        setNewValue("undefined");
      }
      let newValue = eval(
        `function autoRunJavascriptCode() { ${javascriptCode}}; autoRunJavascriptCode()`,
      );
      if (typeof newValue === "object" || Array.isArray(newValue)) {
        try {
          newValue = JSON.stringify(newValue);
        } catch {}
      }

      setNewValue(newValue);
    } catch {
      setNewValue("undefined");
    }
  }, [javascriptCode, variables]);

  return (
    <Popover
      opened={opened}
      withinPortal
      position="left-end"
      arrowPosition="center"
    >
      <Popover.Target>
        <Button size="xs" onClick={onTogglePopover}>
          Binder
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
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
          </Flex>{" "}
          <Box>
            <Text size="sm" fw={500} pb={2}>
              {bindingType}
            </Text>
            {bindingType === "Formula" ? (
              <Textarea
                value={formulaEntry}
                onChange={(event) => setFormulaEntry(event.currentTarget.value)}
              />
            ) : (
              <CustomJavaScriptTextArea
                language="typescript"
                value={javascriptCode}
                variables={variables?.list}
                onChange={onChangeJavascriptCode}
              />
            )}
          </Box>
          <TextInput
            label="Current Value"
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
      </Popover.Dropdown>
    </Popover>
  );
}
