import { ActionIconDefault } from "@/components/ActionIconDefault";
import { SidebarSection } from "@/components/SidebarSection";
import { ActionsTab } from "@/components/actions/ActionsTab";
import { Data } from "@/components/data/Data";
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
import * as CountdownButtonModifier from "@/components/modifiers/CountdownButton";
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
import { useComponentStates } from "@/hooks/useComponentStates";
import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { AUTOCOMPLETE_OFF_PROPS } from "@/utils/common";
import { componentMapper } from "@/utils/componentMapper";
import { dataMapper } from "@/utils/dataMapper";
import { getAllComponentsByIds, getComponentById } from "@/utils/editor";
import { Modifiers } from "@/utils/modifiers";
import {
  ActionIcon,
  Anchor,
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
import { IconCheck, IconX } from "@tabler/icons-react";
import intersection from "lodash.intersection";
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
  countdownButton: CountdownButtonModifier,
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

  const designSections = sections?.map(({ Component, ...item }) => (
    <SidebarSection {...item} key={item.label}>
      <Component key={currentState} initiallyOpened={item.initiallyOpened} />
    </SidebarSection>
  ));

  const onClickResetToDefault = () => {
    updateTreeComponent({
      componentId: selectedComponentId!,
      props: component?.props,
      forceState: currentState,
    });
  };

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
                  <Stack>
                    <Flex justify="space-between">
                      <Text size="xs">State</Text>
                      {currentState !== "default" && (
                        <Tooltip
                          label="Revert to default settings"
                          position="top-end"
                        >
                          <Anchor size="xs" onClick={onClickResetToDefault}>
                            Revert
                          </Anchor>
                        </Tooltip>
                      )}
                    </Flex>
                    <Flex gap="xs">
                      <Select
                        style={{ flex: "1" }}
                        value={currentState}
                        size="xs"
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
                    </Flex>
                  </Stack>
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
          {designSections}
        </Stack>
      )}
      {tab === "data" && <Data component={component!} />}
      {tab === "actions" && <ActionsTab component={component!} />}
    </Stack>
  );
};
