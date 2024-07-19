import { ContextModalProps } from "@mantine/modals";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableTracking } from "@/hooks/editor/reactQuery/useVariableTracking";
import {
  Accordion,
  ActionIcon,
  Group,
  List,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useEditorStore } from "@/stores/editor";
import context from "react-redux/src/components/Context";

export const VariableInstanceTracker = ({
  innerProps,
  context,
  id,
}: ContextModalProps<{ variableId: string }>) => {
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

  const { data = { components: [] }, isLoading } = useVariableTracking(
    projectId,
    pageId,
    innerProps.variableId,
    accessToken,
  );

  const onClickGoToAction = async (componentId: string) => {
    console.log(id);
    context.closeModal(id);
    await setSelectedComponentIds(() => [componentId]);
    await setAsideSelectedTab("actions");
  };

  return (
    <Skeleton visible={isLoading}>
      <Accordion defaultValue="components">
        <Accordion.Item value="components">
          <Accordion.Control>Components</Accordion.Control>
          <Accordion.Panel>
            {data.components?.map((comp: any) => {
              const componentElement =
                iframeWindow?.document?.querySelector(
                  `[data-id^="${comp.componentId}"]`,
                ) ??
                iframeWindow?.document?.querySelector(
                  `[id^="${comp.componentId}"]`,
                );

              const foundElementComponentId = (
                componentElement?.getAttribute("data-id") ??
                componentElement?.getAttribute("id")! ??
                comp.componentId
              ).replace(/-(title|target)$/, "");

              return (
                <Stack key={comp.componentId}>
                  <Title size="sm" order={3}>
                    Actions
                  </Title>
                  <List
                    styles={{ itemWrapper: { width: "100%" } }}
                    withPadding
                    px={10}
                  >
                    {comp.actions?.map((action: any) => (
                      <List.Item key={action.actionEvent}>
                        <Group position="apart">
                          <Text size="xs">
                            {action.trigger} - {action.actionEvent}
                          </Text>
                          <ActionIcon
                            onClick={() =>
                              onClickGoToAction(foundElementComponentId)
                            }
                          >
                            <IconArrowRight size={16} />
                          </ActionIcon>
                        </Group>
                      </List.Item>
                    ))}
                  </List>
                  <Title size="sm">Data</Title>
                  <List
                    styles={{ itemWrapper: { width: "100%" } }}
                    withPadding
                    px={10}
                  >
                    {comp.onLoad?.map((key: any) => (
                      <List.Item key={key}>
                        <Group position="apart">
                          <Text size="xs">{key}</Text>
                          <ActionIcon>
                            <IconArrowRight size={16} />
                          </ActionIcon>
                        </Group>
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              );
            })}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pages">
          <Accordion.Control>Pages</Accordion.Control>
          <Accordion.Panel>
            Configure components appearance and behavior with vast amount of
            settings or overwrite any part of component styles
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pageActions">
          <Accordion.Control>Page Actions</Accordion.Control>
          <Accordion.Panel>
            With new :focus-visible pseudo-class focus ring appears only when
            user navigates with keyboard
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Skeleton>
  );
};
