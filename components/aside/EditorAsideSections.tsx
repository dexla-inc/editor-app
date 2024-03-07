import SidebarSection from "@/components/SidebarSection";
import { StateSelector } from "@/components/aside/StateSelector";
const ActionsTab = dynamic(() =>
  import("@/components/actions/ActionsTab").then((mod) => mod.ActionsTab),
);
const Data = dynamic(() =>
  import("@/components/data/Data").then((mod) => mod.Data),
);
const AccordionModifier = dynamic(
  () => import("@/components/modifiers/Accordion"),
);
const AccordionItemModifier = dynamic(
  () => import("@/components/modifiers/AccordionItem"),
);
const AlertModifier = dynamic(() => import("@/components/modifiers/Alert"));
const AutocompleteModifier = dynamic(
  () => import("@/components/modifiers/Autocomplete"),
);
const AvatarModifier = dynamic(() => import("@/components/modifiers/Avatar"));
const BackgroundModifier = dynamic(
  () => import("@/components/modifiers/Background"),
);
const BadgeModifier = dynamic(() => import("@/components/modifiers/Badge"));
const BorderModifier = dynamic(() => import("@/components/modifiers/Border"));
const BoxShadowModifier = dynamic(
  () => import("@/components/modifiers/BoxShadow"),
);
const BreadcrumbModifier = dynamic(
  () => import("@/components/modifiers/Breadcrumb"),
);
const ButtonModifier = dynamic(() => import("@/components/modifiers/Button"));
const ButtonIconModifier = dynamic(
  () => import("@/components/modifiers/ButtonIcon"),
);
const CheckboxModifier = dynamic(
  () => import("@/components/modifiers/Checkbox"),
);
const CountdownButtonModifier = dynamic(
  () => import("@/components/modifiers/CountdownButton"),
);
const DateInputModifier = dynamic(
  () => import("@/components/modifiers/DateInput"),
);
const DividerModifier = dynamic(() => import("@/components/modifiers/Divider"));
const DrawerModifier = dynamic(() => import("@/components/modifiers/Drawer"));
const EffectsModifier = dynamic(() => import("@/components/modifiers/Effects"));
const FileButtonModifier = dynamic(
  () => import("@/components/modifiers/FileButton"),
);
const GoogleMapModifier = dynamic(
  () => import("@/components/modifiers/GoogleMap"),
);
const GridModifier = dynamic(() => import("@/components/modifiers/Grid"));
const GridColumnModifier = dynamic(
  () => import("@/components/modifiers/GridColumn"),
);
const IconModifier = dynamic(() => import("@/components/modifiers/Icon"));
const ImageModifier = dynamic(() => import("@/components/modifiers/Image"));
const InputModifier = dynamic(() => import("@/components/modifiers/Input"));
const LayoutModifier = dynamic(() => import("@/components/modifiers/Layout"));
const LinkModifier = dynamic(() => import("@/components/modifiers/Link"));
const ModalModifier = dynamic(() => import("@/components/modifiers/Modal"));
const NavLinkModifier = dynamic(() => import("@/components/modifiers/NavLink"));
const NavbarModifier = dynamic(() => import("@/components/modifiers/Navbar"));
const PopOverModifier = dynamic(() => import("@/components/modifiers/PopOver"));
const PositionModifier = dynamic(
  () => import("@/components/modifiers/Position"),
);
const ProgressModifier = dynamic(
  () => import("@/components/modifiers/Progress"),
);
const RadioModifier = dynamic(() => import("@/components/modifiers/Radio"));
const RadioItemModifier = dynamic(
  () => import("@/components/modifiers/RadioItem"),
);
const SelectModifier = dynamic(() => import("@/components/modifiers/Select"));
const SizeModifier = dynamic(() => import("@/components/modifiers/Size"));
const SpacingModifier = dynamic(() => import("@/components/modifiers/Spacing"));
const StepperModifier = dynamic(() => import("@/components/modifiers/Stepper"));
const TabModifier = dynamic(() => import("@/components/modifiers/Tab"));
const TableModifier = dynamic(() => import("@/components/modifiers/Table"));
const TabsModifier = dynamic(() => import("@/components/modifiers/Tabs"));
const TabsListModifier = dynamic(
  () => import("@/components/modifiers/TabsList"),
);
const TabsPanelModifier = dynamic(
  () => import("@/components/modifiers/TabsPanel"),
);
const TextModifier = dynamic(() => import("@/components/modifiers/Text"));
const TextareaModifier = dynamic(
  () => import("@/components/modifiers/Textarea"),
);
const ChartModifier = dynamic(
  () => import("@/components/modifiers/chart/Chart"),
);

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
import dynamic from "next/dynamic";
import { useDeferredValue, useEffect, useState } from "react";

type SectionsMapper = {
  [key in Modifiers]: any;
};

const sectionMapper: SectionsMapper = {
  spacing: { Modifier: SpacingModifier, icon: "IconBoxModel2" },
  size: { Modifier: SizeModifier, icon: "IconResize" },
  text: { Modifier: TextModifier, icon: "IconTextSize" },
  border: { Modifier: BorderModifier, icon: "IconBorderStyle" },
  layout: { Modifier: LayoutModifier, icon: "IconLayout2" },
  background: { Modifier: BackgroundModifier, icon: "IconTexture" },
  input: { Modifier: InputModifier, icon: "IconForms" },
  countdownButton: {
    Modifier: CountdownButtonModifier,
    icon: "IconClockHour5",
  },
  button: { Modifier: ButtonModifier, icon: "IconClick" },
  image: { Modifier: ImageModifier, icon: "IconPhoto" },
  link: { Modifier: LinkModifier, icon: "IconClick" },
  icon: { Modifier: IconModifier, icon: "IconTexture" },
  divider: { Modifier: DividerModifier, icon: "IconDivide" },
  select: { Modifier: SelectModifier, icon: "IconSelect" },
  position: { Modifier: PositionModifier, icon: "IconLayout" },
  effects: { Modifier: EffectsModifier, icon: "IconBrush" },
  modal: { Modifier: ModalModifier, icon: "IconBoxModel" },
  boxShadow: { Modifier: BoxShadowModifier, icon: "IconShadow" },
  checkbox: { Modifier: CheckboxModifier, icon: "IconCheckbox" },
  table: { Modifier: TableModifier, icon: "IconTable" },
  radio: { Modifier: RadioModifier, icon: "IconRadio" },
  radioItem: { Modifier: RadioItemModifier, icon: "IconRadio" },
  drawer: { Modifier: DrawerModifier, icon: "IconLayoutSidebarLeftCollapse" },
  buttonIcon: { Modifier: ButtonIconModifier, icon: "IconCircleDot" },
  mapSettings: { Modifier: GoogleMapModifier, icon: "IconMapPin" },
  stepper: { Modifier: StepperModifier, icon: "IconArrowAutofitContent" },
  fileButton: { Modifier: FileButtonModifier, icon: "IconFileUpload" },
  popOver: { Modifier: PopOverModifier, icon: "IconLayoutSidebarLeftCollapse" },
  navLink: { Modifier: NavLinkModifier, icon: "IconClick" },
  accordionItem: {
    Modifier: AccordionItemModifier,
    icon: "IconLayoutBottombarCollapse",
  },
  accordion: {
    Modifier: AccordionModifier,
    icon: "IconLayoutBottombarCollapse",
  },
  avatar: { Modifier: AvatarModifier, icon: "IconUser" },
  textarea: { Modifier: TextareaModifier, icon: "IconTextPlus" },
  breadcrumb: {
    Modifier: BreadcrumbModifier,
    icon: "IconSlash",
  },
  tabs: { Modifier: TabsModifier, icon: "IconLayoutKanban" },
  tab: { Modifier: TabModifier, icon: "IconLayoutKanban" },
  tabsPanel: { Modifier: TabsPanelModifier, icon: "IconLayoutKanban" },
  tabsList: { Modifier: TabsListModifier, icon: "IconLayoutKanban" },
  alert: { Modifier: AlertModifier, icon: "IconExclamationMark" },
  badge: { Modifier: BadgeModifier, icon: "IconIdBadge" },
  dateInput: { Modifier: DateInputModifier, icon: "IconForms" },
  chart: { Modifier: ChartModifier, icon: "IconChartInfographic" },
  grid: { Modifier: GridModifier, icon: "IconLayoutGrid" },
  gridColumn: { Modifier: GridColumnModifier, icon: "IconLayoutColumns" },
  navbar: { Modifier: NavbarModifier, icon: "IconLayoutSidebar" },
  progress: { Modifier: ProgressModifier, icon: "IconLoader2" },
  autocomplete: {
    Modifier: AutocompleteModifier,
    icon: "IconInputSearch",
  },
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
      label: id,
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
