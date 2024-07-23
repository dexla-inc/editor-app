import { ContextModalProps } from "@mantine/modals";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableTracking } from "@/hooks/editor/reactQuery/useVariableTracking";
import {
  Accordion,
  Anchor,
  Group,
  List,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Tab, useEditorStore } from "@/stores/editor";
import Link from "next/link";
import { useEffect, useState } from "react";

export const VariableInstanceTracker = ({
  innerProps,
  context,
  id,
}: ContextModalProps<{ variableId: string; onClose: () => void }>) => {
  const accessToken = usePropelAuthStore((state) => state.accessToken);
  const projectId = useEditorTreeStore((state) => state.currentProjectId)!;
  const pageId = useEditorTreeStore((state) => state.currentPageId)!;
  const iframeWindow = useEditorStore((state) => state.iframeWindow);
  const setSelectedComponentIds = useEditorTreeStore(
    (state) => state.setSelectedComponentIds,
  );
  const setAsideSelectedTab = useEditorStore(
    (state) => state.setAsideSelectedTab,
  );
  const setOpenAction = useEditorStore((state) => state.setOpenAction);

  const { data = { components: [], pages: [] }, isLoading } =
    useVariableTracking(projectId, pageId, innerProps.variableId, accessToken);

  const selectedTabFlag = !!data.components?.length
    ? "components"
    : !!data.pages?.length
      ? "pages"
      : null;
  const [selectedTab, setSelectedTab] = useState(selectedTabFlag);

  useEffect(() => {
    setSelectedTab(selectedTabFlag);
  }, [selectedTabFlag]);

  const onClickGoToComponentTab = async (
    componentId: string,
    tab: Tab,
    actionId?: string,
  ) => {
    context.closeModal(id);
    innerProps.onClose?.();
    await setSelectedComponentIds(() => [componentId]);
    await setAsideSelectedTab(tab);
    actionId &&
      (await setOpenAction({
        componentId: componentId,
        actionIds: [actionId],
      }));
  };

  const onClickGoToPage = () => {
    context.closeModal(id);
    innerProps.onClose?.();
  };

  return (
    <Skeleton visible={isLoading}>
      <Accordion value={selectedTab} onChange={setSelectedTab}>
        <Accordion.Item value="components">
          <Accordion.Control disabled={!data.components?.length}>
            Components
          </Accordion.Control>
          <Accordion.Panel>
            {data.components?.map((comp: any) => {
              const componentElement =
                iframeWindow?.document?.querySelector(
                  `[data-id^="${comp.id}"]`,
                ) ??
                iframeWindow?.document?.querySelector(`[id^="${comp.id}"]`);

              const foundElementComponentId = (
                componentElement?.getAttribute("data-id") ??
                componentElement?.getAttribute("id")! ??
                comp.id
              ).replace(/-(title|target)$/, "");

              return (
                <Stack key={comp.id} spacing={0}>
                  <Text size="sm">{comp.description}</Text>
                  {!!comp.actions?.length && (
                    <List
                      styles={{ itemWrapper: { width: "100%" } }}
                      listStyleType="none"
                      px={10}
                      withPadding
                    >
                      <List.Item>
                        <Text size="sm">Actions:</Text>
                        <List
                          styles={{ itemWrapper: { width: "100%" } }}
                          withPadding
                          listStyleType="none"
                        >
                          {comp.actions?.map((action: any) => (
                            <List.Item key={action.actionEvent}>
                              <Group position="apart">
                                <Text size="xs">
                                  {action.trigger} - {action.actionEvent}
                                </Text>
                                <Anchor
                                  onClick={() =>
                                    onClickGoToComponentTab(
                                      foundElementComponentId,
                                      "actions",
                                      action.id,
                                    )
                                  }
                                >
                                  <IconArrowRight size={16} />
                                </Anchor>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      </List.Item>
                    </List>
                  )}
                  {!!comp.onLoad?.length && (
                    <List
                      styles={{ itemWrapper: { width: "100%" } }}
                      withPadding
                      px={10}
                      listStyleType="none"
                    >
                      <List.Item>
                        <Text size="sm">Data:</Text>
                        <List
                          styles={{ itemWrapper: { width: "100%" } }}
                          withPadding
                          listStyleType="none"
                        >
                          {comp.onLoad?.map((key: any) => (
                            <List.Item key={key}>
                              <Group position="apart">
                                <Text size="xs">{key}</Text>
                                <Anchor
                                  onClick={() =>
                                    onClickGoToComponentTab(
                                      foundElementComponentId,
                                      "data",
                                    )
                                  }
                                >
                                  <IconArrowRight size={16} />
                                </Anchor>
                              </Group>
                            </List.Item>
                          ))}
                        </List>
                      </List.Item>
                    </List>
                  )}
                </Stack>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pages">
          <Accordion.Control disabled={!data.pages?.length}>
            Pages
          </Accordion.Control>
          <Accordion.Panel>
            {data.pages?.map((page: any) => {
              return (
                <List
                  key={page.id}
                  styles={{ itemWrapper: { width: "100%" } }}
                  withPadding
                  px={10}
                  listStyleType="none"
                >
                  <List.Item key={page.id}>
                    <Group position="apart">
                      <Text size="xs">{page.title}</Text>
                      <Anchor
                        component={Link}
                        href={{
                          pathname: `/projects/${projectId}/editor/${page.id}`,
                        }}
                        onClick={onClickGoToPage}
                      >
                        <IconArrowRight size={16} />
                      </Anchor>
                    </Group>
                    <List
                      styles={{ itemWrapper: { width: "100%" } }}
                      withPadding
                      listStyleType="none"
                    >
                      {page.actions?.map((action: any) => (
                        <List.Item key={action.actionEvent}>
                          <Group position="apart">
                            <Text size="xs">
                              {action.trigger} - {action.actionEvent}
                            </Text>
                            <Anchor
                              component={Link}
                              href={{
                                pathname: `/projects/${projectId}/editor/${page.id}`,
                                query: {
                                  pageActionTrigger: action.trigger,
                                  pageActionEvent: action.actionEvent,
                                },
                              }}
                              onClick={onClickGoToPage}
                            >
                              <IconArrowRight size={16} />
                            </Anchor>
                          </Group>
                        </List.Item>
                      ))}
                    </List>
                  </List.Item>
                </List>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Skeleton>
  );
};
