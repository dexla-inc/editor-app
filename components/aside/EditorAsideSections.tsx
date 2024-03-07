import SidebarSection from "@/components/SidebarSection";
import { ActionsTab } from "@/components/actions/ActionsTab";
import { StateSelector } from "@/components/aside/StateSelector";
import { Data } from "@/components/data/Data";
const AccordionModifier = lazy(
  () => import("@/components/modifiers/Accordion"),
);
const AccordionItemModifier = lazy(
  () => import("@/components/modifiers/AccordionItem"),
);
const AlertModifier = lazy(() => import("@/components/modifiers/Alert"));
const AutocompleteModifier = lazy(
  () => import("@/components/modifiers/Autocomplete"),
);
const AvatarModifier = lazy(() => import("@/components/modifiers/Avatar"));
const BackgroundModifier = lazy(
  () => import("@/components/modifiers/Background"),
);
const BadgeModifier = lazy(() => import("@/components/modifiers/Badge"));
const BorderModifier = lazy(() => import("@/components/modifiers/Border"));
const BoxShadowModifier = lazy(
  () => import("@/components/modifiers/BoxShadow"),
);
const BreadcrumbModifier = lazy(
  () => import("@/components/modifiers/Breadcrumb"),
);
const ButtonModifier = lazy(() => import("@/components/modifiers/Button"));
const ButtonIconModifier = lazy(
  () => import("@/components/modifiers/ButtonIcon"),
);
const CheckboxModifier = lazy(() => import("@/components/modifiers/Checkbox"));
const CountdownButtonModifier = lazy(
  () => import("@/components/modifiers/CountdownButton"),
);
const DateInputModifier = lazy(
  () => import("@/components/modifiers/DateInput"),
);
const DividerModifier = lazy(() => import("@/components/modifiers/Divider"));
const DrawerModifier = lazy(() => import("@/components/modifiers/Drawer"));
const EffectsModifier = lazy(() => import("@/components/modifiers/Effects"));
const FileButtonModifier = lazy(
  () => import("@/components/modifiers/FileButton"),
);
const GoogleMapModifier = lazy(
  () => import("@/components/modifiers/GoogleMap"),
);
const GridModifier = lazy(() => import("@/components/modifiers/Grid"));
const GridColumnModifier = lazy(
  () => import("@/components/modifiers/GridColumn"),
);
const IconModifier = lazy(() => import("@/components/modifiers/Icon"));
const ImageModifier = lazy(() => import("@/components/modifiers/Image"));
const InputModifier = lazy(() => import("@/components/modifiers/Input"));
const LayoutModifier = lazy(() => import("@/components/modifiers/Layout"));
const LinkModifier = lazy(() => import("@/components/modifiers/Link"));
const ModalModifier = lazy(() => import("@/components/modifiers/Modal"));
const NavLinkModifier = lazy(() => import("@/components/modifiers/NavLink"));
const NavbarModifier = lazy(() => import("@/components/modifiers/Navbar"));
const PopOverModifier = lazy(() => import("@/components/modifiers/PopOver"));
const PositionModifier = lazy(() => import("@/components/modifiers/Position"));
const ProgressModifier = lazy(() => import("@/components/modifiers/Progress"));
const RadioModifier = lazy(() => import("@/components/modifiers/Radio"));
const RadioItemModifier = lazy(
  () => import("@/components/modifiers/RadioItem"),
);
const SelectModifier = lazy(() => import("@/components/modifiers/Select"));
const SizeModifier = lazy(() => import("@/components/modifiers/Size"));
const SpacingModifier = lazy(() => import("@/components/modifiers/Spacing"));
const StepperModifier = lazy(() => import("@/components/modifiers/Stepper"));
const TabModifier = lazy(() => import("@/components/modifiers/Tab"));
const TableModifier = lazy(() => import("@/components/modifiers/Table"));
const TabsModifier = lazy(() => import("@/components/modifiers/Tabs"));
const TabsListModifier = lazy(() => import("@/components/modifiers/TabsList"));
const TabsPanelModifier = lazy(
  () => import("@/components/modifiers/TabsPanel"),
);
const TextModifier = lazy(() => import("@/components/modifiers/Text"));
const TextareaModifier = lazy(() => import("@/components/modifiers/Textarea"));
const ChartModifier = lazy(() => import("@/components/modifiers/chart/Chart"));

import { useEditorStore } from "@/stores/editor";
import { useUserConfigStore } from "@/stores/userConfig";
import { componentMapper } from "@/utils/componentMapper";
import { dataMapper } from "@/utils/dataMapper";
import { Modifiers } from "@/utils/modifiers";
import {
  Box,
  Center,
  Flex,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import intersection from "lodash.intersection";
import { lazy, useDeferredValue, useEffect, useState } from "react";

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
  autocomplete: AutocompleteModifier,
};

type Tab = "design" | "data" | "actions";

const EditorAsideSections = () => {
  const _selectedComponentId = useEditorStore(
    (state) => state.selectedComponentIds?.at(-1),
  );
  const selectedComponentIds = useEditorStore(
    (state) => state.selectedComponentIds,
  );
  const openAction = useEditorStore((state) => state.openAction);
  const setOpenAction = useEditorStore((state) => state.setOpenAction);
  const selectedComponentId = useDeferredValue(_selectedComponentId);
  const currentState = useEditorStore(
    (state) =>
      state.currentTreeComponentsStates?.[selectedComponentId!] ?? "default",
  );
  const initiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.initiallyOpenedModifiersByComponent,
  );
  const setInitiallyOpenedModifiersByComponent = useUserConfigStore(
    (state) => state.setInitiallyOpenedModifiersByComponent,
  );

  const [tab, setTab] = useState<Tab>("design");

  const component = useEditorStore(
    (state) => state.componentMutableAttrs[selectedComponentId!],
  );
  const componentName = component?.name ?? "content-wrapper";

  const components = useEditorStore(
    (state) =>
      (state.selectedComponentIds ?? [])?.map(
        (id) => state.componentMutableAttrs[id],
      ),
  );

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

  const designSections = sections?.map(({ Component, ...item }) => (
    <SidebarSection {...item} key={item.label}>
      <Component key={currentState} initiallyOpened={item.initiallyOpened} />
    </SidebarSection>
  ));

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
          {selectedComponentId && (
            <StateSelector componentName={componentName} />
          )}
          {designSections}
        </Stack>
      )}
      {tab === "data" && <Data component={component!} />}
      {tab === "actions" && <ActionsTab component={component!} />}
    </Stack>
  );
};

export default EditorAsideSections;
