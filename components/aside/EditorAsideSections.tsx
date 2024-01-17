import { ActionIconDefault } from "@/components/ActionIconDefault";
import { SidebarSection } from "@/components/SidebarSection";
import { ActionsFlow } from "@/components/actions/ActionsFlow";
import * as AccordionModifier from "@/components/modifiers/Accordion";
import * as AccordionItemModifier from "@/components/modifiers/AccordionItem";
import * as AlertModifier from "@/components/modifiers/Alert";
import * as AvatarModifier from "@/components/modifiers/Avatar";
import * as BackgroundModifier from "@/components/modifiers/Background";
import * as BadgeModifier from "@/components/modifiers/Badge";
import * as BorderModifier from "@/components/modifiers/Border";
import * as BoxShadowModifier from "@/components/modifiers/BoxShadow";
import * as BreadcrumbModifier from "@/components/modifiers/Breadcrumb";
import * as ButtonModifier from "@/components/modifiers/Button";
import * as ButtonIconModifier from "@/components/modifiers/ButtonIcon";
import * as CheckboxModifier from "@/components/modifiers/Checkbox";
import * as DateInputModifier from "@/components/modifiers/DateInput";
import * as DividerModifier from "@/components/modifiers/Divider";
import * as DrawerModifier from "@/components/modifiers/Drawer";
import * as EffectsModifier from "@/components/modifiers/Effects";
import * as FileButtonModifier from "@/components/modifiers/FileButton";
import * as GoogleMapModifier from "@/components/modifiers/GoogleMap";
import * as GridModifier from "@/components/modifiers/Grid";
import * as GridColumnModifier from "@/components/modifiers/GridColumn";
import * as IconModifier from "@/components/modifiers/Icon";
import * as ImageModifier from "@/components/modifiers/Image";
import * as InputModifier from "@/components/modifiers/Input";
import * as LayoutModifier from "@/components/modifiers/Layout";
import * as LinkModifier from "@/components/modifiers/Link";
import * as ModalModifier from "@/components/modifiers/Modal";
import * as NavLinkModifier from "@/components/modifiers/NavLink";
import * as NavbarModifier from "@/components/modifiers/Navbar";
import * as PopOverModifier from "@/components/modifiers/PopOver";
import * as PositionModifier from "@/components/modifiers/Position";
import * as ProgressModifier from "@/components/modifiers/Progress";
import * as RadioModifier from "@/components/modifiers/Radio";
import * as RadioItemModifier from "@/components/modifiers/RadioItem";
import * as SelectModifier from "@/components/modifiers/Select";
import * as SizeModifier from "@/components/modifiers/Size";
import * as SpacingModifier from "@/components/modifiers/Spacing";
import * as StepperModifier from "@/components/modifiers/Stepper";
import * as TabModifier from "@/components/modifiers/Tab";
import * as TableModifier from "@/components/modifiers/Table";
import * as TabsModifier from "@/components/modifiers/Tabs";
import * as TabsListModifier from "@/components/modifiers/TabsList";
import * as TabsPanelModifier from "@/components/modifiers/TabsPanel";
import * as TextModifier from "@/components/modifiers/Text";
import * as TextareaModifier from "@/components/modifiers/Textaarea";
import * as ChartModifier from "@/components/modifiers/chart/Chart";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { Action, actionMapper } from "@/utils/actions";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { componentMapper } from "@/utils/componentMapper";
import { dataMapper } from "@/utils/dataMapper";
import { getAllComponentsByIds, getComponentById } from "@/utils/editor";
import { Modifiers } from "@/utils/modifiers";
import {
  ActionIcon,
  Box,
  Center,
  Flex,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowBadgeRight,
  IconBolt,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import intersection from "lodash.intersection";
import startCase from "lodash.startcase";
import { omit } from "next/dist/shared/lib/router/utils/omit";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

type SectionsMapper = {
  [key in Modifiers]: any;
};

const sectionMapper: SectionsMapper = {
  spacing: SpacingModifier,
  size: SizeModifier,
  text: TextModifier,
  border: BorderModifier,
  layout: LayoutModifier,
  background: BackgroundModifier,
  input: InputModifier,
  button: ButtonModifier,
  image: ImageModifier,
  link: LinkModifier,
  icon: IconModifier,
  divider: DividerModifier,
  select: SelectModifier,
  position: PositionModifier,
  effects: EffectsModifier,
  modal: ModalModifier,
  boxShadow: BoxShadowModifier,
  checkbox: CheckboxModifier,
  table: TableModifier,
  radio: RadioModifier,
  radioItem: RadioItemModifier,
  drawer: DrawerModifier,
  buttonIcon: ButtonIconModifier,
  mapSettings: GoogleMapModifier,
  stepper: StepperModifier,
  fileButton: FileButtonModifier,
  popOver: PopOverModifier,
  navLink: NavLinkModifier,
  accordionItem: AccordionItemModifier,
  accordion: AccordionModifier,
  avatar: AvatarModifier,
  textarea: TextareaModifier,
  breadcrumb: BreadcrumbModifier,
  tabs: TabsModifier,
  tab: TabModifier,
  tabsPanel: TabsPanelModifier,
  tabsList: TabsListModifier,
  alert: AlertModifier,
  badge: BadgeModifier,
  dateInput: DateInputModifier,
  chart: ChartModifier,
  grid: GridModifier,
  gridColumn: GridColumnModifier,
  navbar: NavbarModifier,
  progress: ProgressModifier,
};

type Tab = "design" | "data" | "actions";

const excludeComponentsForState = ["Text", "Title"];

export const EditorAsideSections = () => {
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent,
  );
  const updateTreeComponentActions = useEditorStore(
    (state) => state.updateTreeComponentActions,
  );
  const setCopiedAction = useEditorStore((state) => state.setCopiedAction);
  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const _selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const selectedComponentIds = useEditorStore(
    (state) => state.selectedComponentIds,
  );
  const editorTree = useEditorStore((state) => state.tree);
  const openAction = useEditorStore((state) => state.openAction);
  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const currentTreeComponentsStates = useEditorStore(
    (state) => state.currentTreeComponentsStates,
  );
  const initiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.initiallyOpenedModifiersByComponent,
  );
  const setInitiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.setInitiallyOpenedModifiersByComponent,
  );

  const projectId = useEditorStore((state) => state.currentProjectId);
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  const [tab, setTab] = useState<Tab>("design");
  const selectedComponentId = useDeferredValue(_selectedComponentId);
  const [createState, setCreateState] = useState<undefined | string>(undefined);

  const component = useMemo(
    () => getComponentById(editorTree.root, selectedComponentId as string),
    [editorTree.root, selectedComponentId],
  );
  const componentName = component?.name ?? "content-wrapper";

  const components = useMemo(
    () => getAllComponentsByIds(editorTree.root, selectedComponentIds!),
    [editorTree.root, selectedComponentIds],
  );
  const { getComponentsStates } = useComponentStates();
  const isMappedComponent = components.some(
    (c) => componentMapper[c?.name as string],
  );

  useEffect(() => {
    selectedComponentId !== openAction?.componentId &&
      setOpenAction({ actionIds: undefined, componentId: undefined });
    setTab("design");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponentId]);

  const isContentWrapperSelected = selectedComponentId === "content-wrapper";

  if (!isMappedComponent || isContentWrapperSelected) {
    return (
      <Box p="xl">
        <Center>
          <Text size="xs" color="dimmed" align="center">
            You are unable to edit the Body. Select another component to edit.
          </Text>
        </Center>
      </Box>
    );
  }

  const componentActions = component?.actions ?? [];
  const mappedModifiers = intersection(
    ...components.map((c) => componentMapper[c?.name as string]?.modifiers),
  );

  const sections = mappedModifiers?.map((id) => {
    const modifier = sectionMapper[id];

    return {
      id: id,
      label: modifier.label,
      icon: modifier.icon,
      initiallyOpened:
        initiallyOpenedModifiersByComponent[componentName]?.includes(id),
      Component: modifier.Modifier,
      onClick: (id: string, isOpen: boolean) => {
        setInitiallyOpenedModifiersByComponent(componentName, id, isOpen);
      },
    };
  });

  const currentState =
    currentTreeComponentsStates?.[selectedComponentId!] ?? "default";

  const designSections = sections
    ?.filter((section) => section.id !== "effects")
    .map(({ Component, ...item }) => (
      <SidebarSection {...item} key={item.label}>
        <Component key={currentState} initiallyOpened={item.initiallyOpened} />
      </SidebarSection>
    ));

  const getActionsBySequentialToOrId = (id: string) => {
    return componentActions.filter(
      (a: Action) => a.id === id || a.sequentialTo === id,
    );
  };

  const copyAction = (id: string) => {
    setCopiedAction(getActionsBySequentialToOrId(id));
  };

  const removeAction = (id: string) => {
    const updatedActions = componentActions.filter(
      (a: Action) => a.id !== id && a.sequentialTo !== id,
    );

    setOpenAction({
      ...openAction,
      actionIds: openAction?.actionIds?.filter(
        (a) => a !== id && a !== `seq_${id}`,
      ),
    });
    updateTreeComponentActions(selectedComponentId!, updatedActions);
  };

  const baseItem = {
    isAction: true,
    removeAction,
    copyAction,
    componentId: _selectedComponentId,
    openAction,
  };

  const renderSequentialActions = (action: Action) => {
    return getActionsBySequentialToOrId(action.id).map(
      (sequentialAction: Action) => {
        const sequentialActionName = sequentialAction.action.name;
        const ActionForm = actionMapper[sequentialActionName]?.form;

        const item = {
          ...baseItem,
          id: sequentialAction.id,
          isSequential: true,
          label: `${startCase(sequentialAction.trigger)}: ${startCase(
            sequentialAction.action.name,
          )}`,
          initiallyOpened: openAction?.actionIds?.includes(
            `seq_${sequentialAction.id}`,
          ),
          my: 20,
        };

        return (
          sequentialAction.sequentialTo === action.id && (
            <SidebarSection
              icon={IconArrowBadgeRight}
              {...item}
              key={item.label}
            >
              <ActionForm id={sequentialAction.id} />
            </SidebarSection>
          )
        );
      },
    );
  };

  const onClickResetToDefault = () => {
    updateTreeComponent({
      componentId: selectedComponentId!,
      props: component?.props,
      forceState: currentState,
    });
  };

  const actionsSections = componentActions.map((action: Action) => {
    const isSequential = !!action.sequentialTo;
    const actionName = action.action.name;

    const item = !isSequential
      ? {
          ...baseItem,
          id: action.id,
          label: `${startCase(action.trigger)}: ${startCase(actionName)}`,
          initiallyOpened: openAction?.actionIds?.includes(action.id),
        }
      : undefined;

    if (!actionName) return undefined;

    const ActionForm = actionMapper[actionName]?.form;

    return (
      item && (
        <SidebarSection icon={IconBolt} {...item} key={item.label}>
          <ActionForm id={action.id} />
          {renderSequentialActions(action)}
        </SidebarSection>
      )
    );
  });

  // @ts-ignore
  const DataSection = dataMapper[componentName];

  const tabs = [
    { label: "Design", value: "design" },
    {
      label: "Data",
      value: "data",
      disabled: (selectedComponentIds ?? []).length > 1,
    },
    {
      label: "Actions",
      value: "actions",
      disabled: (selectedComponentIds ?? []).length > 1,
    },
  ].filter(
    (item) => item.value !== "data" || (item.value === "data" && DataSection),
  );

  let { DataComponent, rest }: Record<string, any> = {};
  const appearanceSection = sections?.find(
    (section) => section.id === "effects",
  );
  if (appearanceSection) {
    DataComponent = appearanceSection.Component;
    rest = omit(appearanceSection, ["Component"]);
  }

  return (
    <Stack>
      <Flex px="md">
        <SegmentedControl
          key={JSON.stringify(tabs)}
          size="xs"
          style={{ width: "100%" }}
          data={tabs}
          onChange={(value) => {
            setTab(value as Tab);
            setOpenAction({ actionIds: undefined, componentId: undefined });
          }}
          value={tab}
        />
      </Flex>
      {tab === "design" && (
        <Stack spacing="xs">
          {selectedComponentId &&
            !excludeComponentsForState.includes(componentName) && (
              <Stack spacing="xs" px="md">
                {createState === undefined && (
                  <Flex gap="10px" align="flex-end">
                    <Select
                      style={{ flex: "1" }}
                      value={currentState}
                      size="xs"
                      label="State"
                      data={getComponentsStates()}
                      placeholder="Select State"
                      nothingFound="Nothing found"
                      searchable
                      onChange={(value: string) => {
                        setTreeComponentCurrentState(
                          selectedComponentId,
                          value,
                        );
                      }}
                      {...AUTOCOMPLETE_OFF_PROPS}
                    />
                    <ActionIconDefault
                      iconName="IconPlus"
                      tooltip="Create new state"
                      onClick={() => {
                        setCreateState("");
                      }}
                    />
                    {currentState !== "default" && (
                      <ActionIconDefault
                        iconName="IconRefresh"
                        tooltip="Revert to default settings"
                        onClick={onClickResetToDefault}
                      />
                    )}
                  </Flex>
                )}
                {createState !== undefined && (
                  <Flex gap="10px" align="flex-end">
                    <TextInput
                      style={{ flex: "1" }}
                      size="xs"
                      label="State Name"
                      placeholder="My New State"
                      value={createState}
                      onChange={(event) => {
                        setCreateState(event.currentTarget.value);
                      }}
                    />
                    <Tooltip label={`Cancel`}>
                      <ActionIcon
                        variant="default"
                        size="1.875rem"
                        onClick={() => setCreateState(undefined)}
                      >
                        <IconX size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={`Save new state`}>
                      <ActionIcon
                        color="teal"
                        variant="filled"
                        size="1.875rem"
                        onClick={() => {
                          setTreeComponentCurrentState(
                            selectedComponentId,
                            createState,
                          );
                          updateTreeComponent({
                            componentId: selectedComponentId,
                            props: {},
                            save: true,
                          });
                          setCreateState(undefined);
                        }}
                      >
                        <IconCheck size="1rem" />
                      </ActionIcon>
                    </Tooltip>
                  </Flex>
                )}
              </Stack>
            )}

          <Stack spacing="xs">{designSections}</Stack>
        </Stack>
      )}
      {tab === "data" && DataSection && component && (
        <Stack>
          <Box px="md">
            <DataSection
              key={component?.id}
              component={component}
              endpoints={endpoints}
            />
            {appearanceSection && (
              <SidebarSection {...rest} key={rest.label}>
                <DataComponent
                  key={currentState}
                  initiallyOpened={rest.initiallyOpened}
                />
              </SidebarSection>
            )}
          </Box>
        </Stack>
      )}
      {tab === "actions" && <ActionsFlow actionsSections={actionsSections} />}
    </Stack>
  );
};
