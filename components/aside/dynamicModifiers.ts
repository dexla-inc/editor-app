import { Modifiers } from "@/utils/modifiers";
import dynamic from "next/dynamic";

export const ActionsTab = dynamic(() =>
  import("@/components/actions/ActionsTab").then((mod) => mod.ActionsTab),
);
export const Data = dynamic(() =>
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
const CheckboxGroupModifier = dynamic(
  () => import("@/components/modifiers/CheckboxGroup"),
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
const SelectModifier = dynamic(() => import("@/components/modifiers/Select"));
const SizeModifier = dynamic(() => import("@/components/modifiers/Size"));
const SpacingModifier = dynamic(() => import("@/components/modifiers/Spacing"));
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
const ChartModifier = dynamic(() => import("@/components/modifiers/Chart"));
const CodeEmbedModifier = dynamic(
  () => import("@/components/modifiers/CodeEmbed"),
);
const ColorPickerModifier = dynamic(
  () => import("@/components/modifiers/ColorPicker"),
);

type SectionsMapper = {
  [key in Modifiers]: any;
};

export const modifierSectionMapper: SectionsMapper = {
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
  checkboxGroup: { Modifier: CheckboxGroupModifier, icon: "IconListCheck" },
  table: { Modifier: TableModifier, icon: "IconTable" },
  radio: { Modifier: RadioModifier, icon: "IconRadio" },
  drawer: { Modifier: DrawerModifier, icon: "IconLayoutSidebarLeftCollapse" },
  buttonIcon: { Modifier: ButtonIconModifier, icon: "IconCircleDot" },
  mapSettings: { Modifier: GoogleMapModifier, icon: "IconMapPin" },
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
  codeEmbed: { Modifier: CodeEmbedModifier, icon: "IconCode" },
  colorPicker: { Modifier: ColorPickerModifier, icon: "IconFilter" },
};
