import { Accordion } from "@/components/mapper/Accordion";
import { AccordionControl } from "@/components/mapper/AccordionControl";
import { AccordionItem } from "@/components/mapper/AccordionItem";
import { AccordionPanel } from "@/components/mapper/AccordionPanel";
import { Alert } from "@/components/mapper/Alert";
import { AppBar } from "@/components/mapper/AppBar";
import { Autocomplete } from "@/components/mapper/Autocomplete";
import { Avatar } from "@/components/mapper/Avatar";
import { Badge } from "@/components/mapper/Badge";
import { Breadcrumb } from "@/components/mapper/Breadcrumb";
import { Button } from "@/components/mapper/Button";
import { ButtonIcon } from "@/components/mapper/ButtonIcon";
import { Card } from "@/components/mapper/Card";
import { Checkbox } from "@/components/mapper/Checkbox";
import { CheckboxGroup } from "@/components/mapper/CheckboxGroup";
import { CheckboxItem } from "@/components/mapper/CheckboxItem";
import { Container } from "@/components/mapper/Container";
import { CountdownButton } from "@/components/mapper/CountdownButton";
import { DateInput } from "@/components/mapper/DateInput";
import { Divider } from "@/components/mapper/Divider";
import { Drawer } from "@/components/mapper/Drawer";
import { FileUpload } from "@/components/mapper/FileUpload";
import { Form } from "@/components/mapper/Form";
import { GoogleMapPlugin } from "@/components/mapper/GoogleMapPlugin";
import { Grid } from "@/components/mapper/Grid";
import { GridColumn } from "@/components/mapper/GridColumn";
import { Icon } from "@/components/mapper/Icon";
import { Image } from "@/components/mapper/Image";
import { Input } from "@/components/mapper/Input";
import { Link } from "@/components/mapper/Link";
import { Modal } from "@/components/mapper/Modal";
import { NavLink } from "@/components/mapper/NavLink";
import { Navbar } from "@/components/mapper/Navbar";
import { Pagination } from "@/components/mapper/Pagination";
import { PopOver } from "@/components/mapper/PopOver";
import { Progress } from "@/components/mapper/Progress";
import { Radio } from "@/components/mapper/Radio";
import { RadioItem } from "@/components/mapper/RadioItem";
import { Rating } from "@/components/mapper/Rating";
import { Select } from "@/components/mapper/Select";
import { Switch } from "@/components/mapper/Switch";
import { Tab } from "@/components/mapper/Tab";
import { Tabs } from "@/components/mapper/Tabs";
import { Text } from "@/components/mapper/Text";
import { Textarea } from "@/components/mapper/Textarea";
import { Title } from "@/components/mapper/Title";
import { RadialChart } from "@/components/mapper/charts/RadialChart";

import { AreaChart } from "@/components/mapper/charts/AreaChart";
import { BarChart } from "@/components/mapper/charts/BarChart";
import { LineChart } from "@/components/mapper/charts/LineChart";
import { PieChart } from "@/components/mapper/charts/PieChart";
import { RadarChart } from "@/components/mapper/charts/RadarChart";
import * as AccordionStructure from "@/libs/dnd-grid/components/mapper/structure/Accordion";
import * as AccordionItemStructure from "@/libs/dnd-grid/components/mapper/structure/AccordionItem";
import * as AlertStructure from "@/libs/dnd-grid/components/mapper/structure/Alert";
import * as AppBarStructure from "@/libs/dnd-grid/components/mapper/structure/AppBar";
import * as AutocompleteStructure from "@/libs/dnd-grid/components/mapper/structure/Autocomplete";
import * as AvatarStructure from "@/libs/dnd-grid/components/mapper/structure/Avatar";
import * as BadgeStructure from "@/libs/dnd-grid/components/mapper/structure/Badge";
import * as BreadcrumbsStructure from "@/libs/dnd-grid/components/mapper/structure/Breadcrumb";
import * as ButtonStructure from "@/libs/dnd-grid/components/mapper/structure/Button";
import * as ButtonIconStructure from "@/libs/dnd-grid/components/mapper/structure/ButtonIcon";
import * as CardStructure from "@/libs/dnd-grid/components/mapper/structure/Card";
import * as CheckboxStructure from "@/libs/dnd-grid/components/mapper/structure/Checkbox";
import * as CheckboxGroupStructure from "@/libs/dnd-grid/components/mapper/structure/CheckboxGroup";
import * as CheckboxItemStructure from "@/libs/dnd-grid/components/mapper/structure/CheckboxItem";
import * as CodeEmbedStructure from "@/libs/dnd-grid/components/mapper/structure/CodeEmbed";
import * as ContainerStructure from "@/libs/dnd-grid/components/mapper/structure/Container";
import * as CountdownButtonStructure from "@/libs/dnd-grid/components/mapper/structure/CountdownButton";
import * as DateInputStructure from "@/libs/dnd-grid/components/mapper/structure/DateInput";
import * as DividerStructure from "@/libs/dnd-grid/components/mapper/structure/Divider";
import * as DrawerStructure from "@/libs/dnd-grid/components/mapper/structure/Drawer";
import * as FileButtonStructure from "@/libs/dnd-grid/components/mapper/structure/FileButton";
import * as FileUploadStructure from "@/libs/dnd-grid/components/mapper/structure/FileUpload";
import * as FormStructure from "@/libs/dnd-grid/components/mapper/structure/Form";
import * as MapStructure from "@/libs/dnd-grid/components/mapper/structure/GoogleMap";
import * as GridStructure from "@/libs/dnd-grid/components/mapper/structure/Grid";
import * as GridColumnStructure from "@/libs/dnd-grid/components/mapper/structure/GridColumn";
import * as IconStructure from "@/libs/dnd-grid/components/mapper/structure/Icon";
import * as ImageStructure from "@/libs/dnd-grid/components/mapper/structure/Image";
import * as InputStructure from "@/libs/dnd-grid/components/mapper/structure/Input";
import * as LinkStructure from "@/libs/dnd-grid/components/mapper/structure/Link";
import * as ModalStructure from "@/libs/dnd-grid/components/mapper/structure/Modal";
import * as NavLinkStructure from "@/libs/dnd-grid/components/mapper/structure/NavLink";
import * as NavbarStructure from "@/libs/dnd-grid/components/mapper/structure/Navbar";
import * as PaginationStructure from "@/libs/dnd-grid/components/mapper/structure/Pagination";
import * as PopOverStructure from "@/libs/dnd-grid/components/mapper/structure/PopOver";
import * as ProgressStructure from "@/libs/dnd-grid/components/mapper/structure/Progress";
import * as RadioStructure from "@/libs/dnd-grid/components/mapper/structure/Radio";
import * as RadioItemStructure from "@/libs/dnd-grid/components/mapper/structure/RadioItem";
import * as RatingStructure from "@/libs/dnd-grid/components/mapper/structure/Rating";
import * as SelectStructure from "@/libs/dnd-grid/components/mapper/structure/Select";
import * as SwitchStructure from "@/libs/dnd-grid/components/mapper/structure/Switch";
import * as TabsStructure from "@/libs/dnd-grid/components/mapper/structure/Tabs";
import * as TextStructure from "@/libs/dnd-grid/components/mapper/structure/Text";
import * as TextareaStructure from "@/libs/dnd-grid/components/mapper/structure/Textarea";
import * as TitleStructure from "@/libs/dnd-grid/components/mapper/structure/Title";
import * as AreaChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/AreaChart";
import * as BarChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/BarChart";
import * as LineChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/LineChart";
import * as PieChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/PieChart";
import * as RadarChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/RadarChart";
import * as RadialChartStructure from "@/libs/dnd-grid/components/mapper/structure/charts/RadialChart";
import * as ColorPickerStructure from "@/libs/dnd-flex/components/mapper/structure/ColorPicker";

import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { Component, ComponentStructure } from "@/utils/editor";

import { FileButton } from "@/components/mapper/FileButton";
import { TabsList } from "@/components/mapper/TabsList";
import { TabsPanel } from "@/components/mapper/TabsPanel";
import { ActionTrigger, SequentialTrigger } from "@/utils/actions";
import { Modifiers } from "@/utils/modifiers";
import { CodeEmbed } from "@/components/mapper/CodeEmbed";
import { ColorPicker } from "@/components/mapper/ColorPicker";

import {
  addAccordionItemToolboxAction,
  addColumnToParentToolboxAction,
  addColumnToolboxAction,
  addTabToolboxAction,
  insertGridToolboxAction,
  insertRowToolboxAction,
} from "@/utils/toolboxActions";
import {
  IconBoxModel,
  IconBrandChrome,
  IconCalendar,
  IconChartArcs,
  IconChartAreaLine,
  IconChartBar,
  IconChartDonut,
  IconChartLine,
  IconChartPie,
  IconChartRadar,
  IconCheckbox,
  IconCircleDot,
  IconClick,
  IconClockHour5,
  IconCode,
  IconColorFilter,
  IconContainer,
  IconCursorText,
  IconExclamationMark,
  IconFile,
  IconFileText,
  IconFileUpload,
  IconForms,
  IconGradienter,
  IconHeading,
  IconIdBadge,
  IconInputSearch,
  IconJewishStar,
  IconLayoutBottombarCollapse,
  IconLayoutCards,
  IconLayoutColumns,
  IconLayoutDistributeHorizontal,
  IconLayoutGrid,
  IconLayoutKanban,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconLayoutSidebarLeftCollapse,
  IconLink,
  IconListCheck,
  IconLoader2,
  IconMapPin,
  IconPageBreak,
  IconPhoto,
  IconPictureInPicture,
  IconSelect,
  IconSeparator,
  IconSlash,
  IconStackPop,
  IconToggleLeft,
  IconUser,
} from "@tabler/icons-react";
import { DraggableComponent as DraggableComponentGrid } from "@/libs/dnd-grid/components/DraggableComponent";
import { DraggableComponent as DraggableComponentFlex } from "@/libs/dnd-flex/components/DraggableComponent";

// Import structures from dnd-flex
import * as AccordionStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Accordion";
import * as AccordionItemStructureFlex from "@/libs/dnd-flex/components/mapper/structure/AccordionItem";
import * as AlertStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Alert";
import * as AppBarStructureFlex from "@/libs/dnd-flex/components/mapper/structure/AppBar";
import * as AutocompleteStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Autocomplete";
import * as AvatarStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Avatar";
import * as BadgeStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Badge";
import * as BreadcrumbsStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Breadcrumb";
import * as ButtonStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Button";
import * as ButtonIconStructureFlex from "@/libs/dnd-flex/components/mapper/structure/ButtonIcon";
import * as CardStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Card";
import * as CheckboxStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Checkbox";
import * as CheckboxGroupStructureFlex from "@/libs/dnd-flex/components/mapper/structure/CheckboxGroup";
import * as CheckboxItemStructureFlex from "@/libs/dnd-flex/components/mapper/structure/CheckboxItem";
import * as CodeEmbedStructureFlex from "@/libs/dnd-flex/components/mapper/structure/CodeEmbed";
import * as ContainerStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Container";
import * as CountdownButtonStructureFlex from "@/libs/dnd-flex/components/mapper/structure/CountdownButton";
import * as DateInputStructureFlex from "@/libs/dnd-flex/components/mapper/structure/DateInput";
import * as DividerStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Divider";
import * as DrawerStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Drawer";
import * as FileButtonStructureFlex from "@/libs/dnd-flex/components/mapper/structure/FileButton";
import * as FileUploadStructureFlex from "@/libs/dnd-flex/components/mapper/structure/FileUpload";
import * as FormStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Form";
import * as MapStructureFlex from "@/libs/dnd-flex/components/mapper/structure/GoogleMap";
import * as GridStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Grid";
import * as GridColumnStructureFlex from "@/libs/dnd-flex/components/mapper/structure/GridColumn";
import * as IconStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Icon";
import * as ImageStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Image";
import * as InputStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Input";
import * as LinkStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Link";
import * as ModalStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Modal";
import * as NavLinkStructureFlex from "@/libs/dnd-flex/components/mapper/structure/NavLink";
import * as NavbarStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Navbar";
import * as PaginationStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Pagination";
import * as PopOverStructureFlex from "@/libs/dnd-flex/components/mapper/structure/PopOver";
import * as ProgressStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Progress";
import * as RadioStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Radio";
import * as RadioItemStructureFlex from "@/libs/dnd-flex/components/mapper/structure/RadioItem";
import * as RatingStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Rating";
import * as SelectStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Select";
import * as SwitchStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Switch";
import * as TabsStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Tabs";
import * as TextStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Text";
import * as TextareaStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Textarea";
import * as TitleStructureFlex from "@/libs/dnd-flex/components/mapper/structure/Title";
import * as AreaChartStructureFlex from "@/libs/dnd-flex/components/mapper/structure/charts/AreaChart";
import * as BarChartStructureFlex from "@/libs/dnd-flex/components/mapper/structure/charts/BarChart";
import * as LineChartStructureFlex from "@/libs/dnd-flex/components/mapper/structure/charts/LineChart";
import * as PieChartStructureFlex from "@/libs/dnd-flex/components/mapper/structure/charts/PieChart";
import * as RadarChartStructureFlex from "@/libs/dnd-flex/components/mapper/structure/charts/RadarChart";
import * as RadialChartStructureFlex from "@/libs/dnd-flex/components/mapper/structure/charts/RadialChart";
import * as ColorPickerStructureFlex from "@/libs/dnd-flex/components/mapper/structure/ColorPicker";

import { useEditorTreeStore } from "@/stores/editorTree";

export type ComponentCategoryType =
  | "Layout"
  | "Input"
  | "Typography"
  | "Navigation"
  | "Data Display"
  | "Feedback"
  | "Card"
  | "Chart"
  | "Overlays"
  | "Third Party"
  | "Advanced";

export type StructureDefinition = {
  structure: (props: any) => Component;
  Draggable?: any;
  category: ComponentCategoryType;
  icon?: JSX.Element;
  hide?: boolean;
  synonyms?: string[];
};

export type StructureMapper = {
  [key: string]: StructureDefinition;
};

export const structureMapper = (forceCssType: string = ""): StructureMapper => {
  const cssType = forceCssType || useEditorTreeStore.getState().cssType;
  const DraggableComponent =
    cssType === "FLEX" ? DraggableComponentFlex : DraggableComponentGrid;

  return {
    // AI generated structures
    ...(cssType === "FLEX" && {
      Grid: {
        structure: (props: any) => GridStructure.jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="Grid"
            icon={<IconLayoutGrid size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Layout",
        icon: <IconLayoutGrid size={ICON_SIZE} />,
        synonyms: ["Grid Layout", "Grid System"],
      },
      GridColumn: {
        structure: (props: any) => GridColumnStructure.jsonStructure(props),
        category: "Layout",
        icon: <IconLayoutColumns size={ICON_SIZE} />,
        synonyms: ["Grid Col", "Grid Cell"],
      },
      Accordion: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? AccordionStructureFlex
            : AccordionStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="Accordion"
            icon={<IconLayoutBottombarCollapse size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Data Display",
        icon: <IconLayoutBottombarCollapse size={ICON_SIZE} />,
        synonyms: ["Collapsible", "Expandable"],
      },
      AccordionItem: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? AccordionItemStructureFlex
            : AccordionItemStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="AccordionItem"
            icon={<IconLayoutNavbar size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Data Display",
        icon: <IconLayoutNavbar size={ICON_SIZE} />,
        synonyms: ["Accordion Section", "Accordion Element"],
        hide: true,
      },
      AccordionControl: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? AccordionItemStructureFlex
            : AccordionItemStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="AccordionControl"
            icon={<IconLayoutDistributeHorizontal size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Data Display",
        icon: <IconLayoutDistributeHorizontal size={ICON_SIZE} />,
        synonyms: ["Accordion Control", "Accordion Tabs"],
        hide: true,
      },
      Navbar: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? NavbarStructureFlex
            : NavbarStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="Navbar"
            icon={<IconLayoutSidebar size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Navigation",
        icon: <IconLayoutSidebar size={ICON_SIZE} />,
        synonyms: ["Navigation Bar", "Menu Bar"],
      },
      AppBar: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? AppBarStructureFlex
            : AppBarStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="AppBar"
            icon={<IconLayoutNavbar size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Navigation",
        icon: <IconLayoutNavbar size={ICON_SIZE} />,
        synonyms: ["Navigation Bar", "Top Bar"],
      },
      Tabs: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? TabsStructureFlex
            : TabsStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="Tabs"
            icon={<IconLayoutKanban size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Navigation",
        icon: <IconLayoutKanban size={ICON_SIZE} />,
      },
      BarChart: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? BarChartStructureFlex
            : BarChartStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="BarChart"
            icon={<IconChartBar size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Chart",
        icon: <IconChartBar size={ICON_SIZE} />,
        synonyms: ["Bar Graph", "Column Chart"],
      },
      // StackedBarChart: {
      //   structure: (props: any) => NotImplemented.jsonStructure(props),
      //   category: "Chart",
      // },
      // MixBarChart: {
      //   structure: (props: any) => NotImplemented.jsonStructure(props),
      //   category: "Chart",
      // },
      // ScatterChart: {
      //   structure: (props: any) => NotImplemented.jsonStructure(props),
      //   category: "Chart",
      // },
      LineChart: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? LineChartStructureFlex
            : LineChartStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="LineChart"
            icon={<IconChartLine size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Chart",
        icon: <IconChartLine size={ICON_SIZE} />,
        synonyms: ["Line Graph", "Line Plot"],
      },
      PieChart: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? PieChartStructureFlex
            : PieChartStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="PieChart"
            icon={<IconChartPie size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Chart",
        icon: <IconChartPie size={ICON_SIZE} />,
        synonyms: ["Pie Graph", "Circle Chart"],
      },
      AreaChart: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? AreaChartStructureFlex
            : AreaChartStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="AreaChart"
            icon={<IconChartAreaLine size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Chart",
        icon: <IconChartAreaLine size={ICON_SIZE} />,
        synonyms: ["Area Graph", "Filled Line Chart"],
      },
      // ComposedChart: {
      //   structure: (props: any) => NotImplemented.jsonStructure(props),
      //   category: "Chart",
      // },
      // StackedAreaChart: {
      //   structure: (props: any) => NotImplemented.jsonStructure(props),
      //   category: "Chart",
      // },
      // PercentAreaChart: {
      //   structure: (props: any) => NotImplemented.jsonStructure(props),
      //   category: "Chart",
      // },
      RadarChart: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? RadarChartStructureFlex
            : RadarChartStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="RadarChart"
            icon={<IconChartRadar size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Chart",
        icon: <IconChartRadar size={ICON_SIZE} />,
        synonyms: ["Spider Chart", "Web Chart"],
      },
      RadialChart: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? RadialChartStructureFlex
            : RadialChartStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="RadialChart"
            icon={<IconChartArcs size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Chart",
        icon: <IconChartDonut size={ICON_SIZE} />,
        synonyms: ["Donut Chart", "Circular Chart"],
      },
      GoogleMap: {
        structure: (props: any) =>
          (cssType === "FLEX" ? MapStructureFlex : MapStructure).jsonStructure(
            props,
          ),
        Draggable: () => (
          <DraggableComponent
            id="GoogleMap"
            icon={<IconMapPin size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Third Party",
        icon: <IconMapPin size={ICON_SIZE} />,
        synonyms: ["Google Maps", "Map Plugin"],
      },
      CodeEmbed: {
        structure: (props: any) =>
          (cssType === "FLEX"
            ? CodeEmbedStructureFlex
            : CodeEmbedStructure
          ).jsonStructure(props),
        Draggable: () => (
          <DraggableComponent
            id="CodeEmbed"
            icon={<IconCode size={LARGE_ICON_SIZE} />}
          />
        ),
        category: "Advanced",
        icon: <IconCode size={ICON_SIZE} />,
        synonyms: [
          "Html Code",
          "Custom Code",
          "Embed Code",
          "Embed HTML",
          "Embed CSS",
          "Embed JS",
        ],
      },
    }),
    Container: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ContainerStructureFlex
          : ContainerStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Container"
          icon={<IconContainer size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Layout",
      icon: <IconContainer size={ICON_SIZE} />,
      synonyms: ["Wrapper", "Box"],
    },
    Card: {
      structure: (props: any) =>
        (cssType === "FLEX" ? CardStructureFlex : CardStructure).jsonStructure(
          props,
        ),
      Draggable: () => (
        <DraggableComponent
          id="Card"
          icon={<IconLayoutCards size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Layout",
      icon: <IconLayoutCards size={ICON_SIZE} />,
      synonyms: ["Panel", "Tile"],
    },
    Button: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ButtonStructureFlex
          : ButtonStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Button"
          icon={<IconClick size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconClick size={ICON_SIZE} />,
    },
    Input: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? InputStructureFlex
          : InputStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Input"
          icon={<IconFileText size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconFileText size={ICON_SIZE} />,
      synonyms: [
        "TextField",
        "Input Field",
        "Email Input",
        "Text Input",
        "Password Input",
        "Number Input",
        "Phone Input",
        "Search Input",
        "URL Input",
      ],
    },
    Select: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? SelectStructureFlex
          : SelectStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Select"
          icon={<IconSelect size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconSelect size={ICON_SIZE} />,
      synonyms: ["Dropdown", "Select Input"],
    },
    CheckboxGroup: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? CheckboxGroupStructureFlex
          : CheckboxGroupStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="CheckboxGroup"
          icon={<IconListCheck size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconListCheck size={ICON_SIZE} />,
      synonyms: ["Checkboxes", "Checkbox Set"],
    },
    Checkbox: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? CheckboxStructureFlex
          : CheckboxStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Checkbox"
          icon={<IconCheckbox size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconCheckbox size={ICON_SIZE} />,
      synonyms: ["Tickbox", "Checkmark Box"],
    },
    CheckboxItem: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? CheckboxItemStructureFlex
          : CheckboxItemStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="CheckboxItem"
          icon={<IconCheckbox size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconCheckbox size={ICON_SIZE} />,
      // Need to add a way to hide components that should not be visible in components list.
      hide: true,
      synonyms: ["Checkbox Element", "Check Item"],
    },
    Radio: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? RadioStructureFlex
          : RadioStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Radio"
          icon={<IconCircleDot size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconCircleDot size={ICON_SIZE} />,
      synonyms: ["Radio Button", "Option Button"],
    },
    RadioItem: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? RadioItemStructureFlex
          : RadioItemStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="RadioItem"
          icon={<IconGradienter size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconGradienter size={ICON_SIZE} />,
      hide: true,
      synonyms: ["Radio Option", "Radio Element"],
    },
    Form: {
      structure: (props: any) =>
        (cssType === "FLEX" ? FormStructureFlex : FormStructure).jsonStructure(
          props,
        ),
      Draggable: () => (
        <DraggableComponent
          id="Form"
          icon={<IconForms size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconForms size={ICON_SIZE} />,
    },
    Switch: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? SwitchStructureFlex
          : SwitchStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Switch"
          icon={<IconToggleLeft size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconToggleLeft size={ICON_SIZE} />,
      synonyms: ["Toggle"],
    },
    DateInput: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? DateInputStructureFlex
          : DateInputStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="DateInput"
          icon={<IconCalendar size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconCalendar size={ICON_SIZE} />,
      synonyms: ["Date Picker", "Date Field"],
    },
    Textarea: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? TextareaStructureFlex
          : TextareaStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Textarea"
          icon={<IconPictureInPicture size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconPictureInPicture size={ICON_SIZE} />,
      synonyms: ["Text Area", "Multiline Input"],
    },
    ButtonIcon: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ButtonIconStructureFlex
          : ButtonIconStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="ButtonIcon"
          icon={<IconCircleDot size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconCircleDot size={ICON_SIZE} />,
      synonyms: ["IconButton", "Icon Button", "Action Icon"],
    },
    Autocomplete: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? AutocompleteStructureFlex
          : AutocompleteStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Autocomplete"
          icon={<IconInputSearch size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconInputSearch size={ICON_SIZE} />,
      synonyms: ["Typeahead", "Autosuggest"],
    },
    FileButton: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? FileButtonStructureFlex
          : FileButtonStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="FileButton"
          icon={<IconFileUpload size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconFileUpload size={ICON_SIZE} />,
      synonyms: ["File Uploader", "Upload Input", "File Input"],
    },
    FileUpload: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? FileUploadStructureFlex
          : FileUploadStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="FileUpload"
          icon={<IconFile size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconFile size={ICON_SIZE} />,
      synonyms: ["File Uploader", "Upload Input", "File Input"],
    },
    Rating: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? RatingStructureFlex
          : RatingStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Rating"
          icon={<IconJewishStar size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconJewishStar size={ICON_SIZE} />,
      synonyms: ["Star Rating", "Review Rating"],
    },
    CountdownButton: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? CountdownButtonStructureFlex
          : CountdownButtonStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="CountdownButton"
          icon={<IconClockHour5 size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconClockHour5 size={ICON_SIZE} />,
      synonyms: ["Timer Button", "Countdown Timer"],
    },
    Text: {
      structure: (props: any) =>
        (cssType === "FLEX" ? TextStructureFlex : TextStructure).jsonStructure(
          props,
        ),
      Draggable: () => (
        <DraggableComponent
          id="Text"
          icon={<IconCursorText size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Typography",
      icon: <IconCursorText size={ICON_SIZE} />,
      synonyms: ["Paragraph", "Text Block", "Label"],
    },
    Title: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? TitleStructureFlex
          : TitleStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Title"
          icon={<IconHeading size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Typography",
      icon: <IconHeading size={ICON_SIZE} />,
      synonyms: ["Heading", "Header"],
    },
    // Table: {
    //   structure: (props: any) => TableStructure.jsonStructure(props),
    //   Draggable: () => (
    //     <DraggableComponent
    //       id="Table"
    //       icon={<IconTable size={LARGE_ICON_SIZE} />}
    //     />
    //   ),
    //   category: "Data Display",
    //   icon: <IconTable size={ICON_SIZE} />,
    // },
    // TableCell: {
    //   structure: (props: any) => TableCellStructure.jsonStructure(props),
    //   Draggable: () => (
    //     <DraggableComponent
    //       id="TableCell"
    //       icon={<IconTable size={LARGE_ICON_SIZE} />}
    //     />
    //   ),
    //   category: "Data Display",
    //   icon: <IconTable size={ICON_SIZE} />,
    // },
    Icon: {
      structure: (props: any) =>
        (cssType === "FLEX" ? IconStructureFlex : IconStructure).jsonStructure(
          props,
        ),
      Draggable: () => (
        <DraggableComponent
          id="Icon"
          icon={<IconBrandChrome size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Data Display",
      icon: <IconBrandChrome size={ICON_SIZE} />,
      synonyms: ["Symbol", "Glyph"],
    },
    Image: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ImageStructureFlex
          : ImageStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Image"
          icon={<IconPhoto size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Data Display",
      icon: <IconPhoto size={ICON_SIZE} />,
      synonyms: ["Picture", "Photo"],
    },
    // CodeSnippet: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Data Display",
    // },
    Divider: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? DividerStructureFlex
          : DividerStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Divider"
          icon={<IconSeparator size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Data Display",
      icon: <IconSeparator size={ICON_SIZE} />,
      synonyms: ["Separator", "Line Break"],
    },
    // Newsfeed: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Data Display",
    // },
    // CardList: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   Draggable: () => (
    //     <DraggableComponent
    //       id="CardList"
    //       icon={<IconCards size={LARGE_ICON_SIZE} />}
    //     />
    //   ),
    //   category: "Data Display",
    //   icon: <IconCards size={ICON_SIZE} />,
    // },
    // TaskList: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   Draggable: () => (
    //     <DraggableComponent
    //       id="TaskList"
    //       icon={<IconListCheck size={LARGE_ICON_SIZE} />}
    //     />
    //   ),
    //   category: "Data Display",
    //   icon: <IconListCheck size={ICON_SIZE} />,
    // },
    // ProfileList: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   Draggable: () => (
    //     <DraggableComponent
    //       id="ProfileList"
    //       icon={<IconUsers size={LARGE_ICON_SIZE} />}
    //     />
    //   ),
    //   category: "Data Display",
    //   icon: <IconUsers size={ICON_SIZE} />,
    // },
    Avatar: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? AvatarStructureFlex
          : AvatarStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Avatar"
          icon={<IconUser size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Data Display",
      icon: <IconUser size={ICON_SIZE} />,
      synonyms: ["Profile Picture", "User Image"],
    },
    Alert: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? AlertStructureFlex
          : AlertStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Alert"
          icon={<IconExclamationMark size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Data Display",
      icon: <IconExclamationMark size={ICON_SIZE} />,
      synonyms: ["Notification", "Warning"],
    },
    // List: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Data Display",
    // },
    Link: {
      structure: (props: any) =>
        (cssType === "FLEX" ? LinkStructureFlex : LinkStructure).jsonStructure(
          props,
        ),
      Draggable: () => (
        <DraggableComponent
          id="Link"
          icon={<IconLink size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Navigation",
      icon: <IconLink size={ICON_SIZE} />,
      synonyms: ["Hyperlink", "Anchor"],
    },
    NavLink: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? NavLinkStructureFlex
          : NavLinkStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="NavLink"
          icon={<IconClick size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Navigation",
      icon: <IconClick size={ICON_SIZE} />,
      synonyms: ["Navigation Link", "Menu Link"],
    },
    Breadcrumb: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? BreadcrumbsStructureFlex
          : BreadcrumbsStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Breadcrumb"
          icon={<IconSlash size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Navigation",
      icon: <IconSlash size={ICON_SIZE} />,
      synonyms: ["Breadcrumbs", "Navigation Path"],
    },
    Pagination: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? PaginationStructureFlex
          : PaginationStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Pagination"
          icon={<IconPageBreak size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Navigation",
      icon: <IconPageBreak size={ICON_SIZE} />,
      synonyms: ["Pager", "Page Navigator"],
    },
    // Carousel: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Navigation",
    // },
    // ProgressCard: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Card",
    // },
    // ImageCard: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Card",
    // },
    // ProfileCard: {
    //   structure: (props: any) => NotImplemented.jsonStructure(props),
    //   category: "Card",
    // },
    Badge: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? BadgeStructureFlex
          : BadgeStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Badge"
          icon={<IconIdBadge size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Feedback",
      icon: <IconIdBadge size={ICON_SIZE} />,
      synonyms: ["Label", "Tag"],
    },
    Progress: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ProgressStructureFlex
          : ProgressStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Progress"
          icon={<IconLoader2 size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Feedback",
      icon: <IconLoader2 size={ICON_SIZE} />,
      synonyms: ["Progress Bar", "Loading Bar"],
    },
    Modal: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ModalStructureFlex
          : ModalStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Modal"
          icon={<IconBoxModel size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Overlays",
      icon: <IconBoxModel size={ICON_SIZE} />,
      synonyms: ["Dialog", "Popup"],
    },
    Drawer: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? DrawerStructureFlex
          : DrawerStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="Drawer"
          icon={<IconLayoutSidebarLeftCollapse size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Overlays",
      icon: <IconLayoutSidebarLeftCollapse size={ICON_SIZE} />,
      synonyms: ["Slideout", "Side Panel"],
    },
    PopOver: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? PopOverStructureFlex
          : PopOverStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="PopOver"
          icon={<IconStackPop size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Overlays",
      icon: <IconStackPop size={ICON_SIZE} />,
      synonyms: ["Tooltip"],
    },
    ColorPicker: {
      structure: (props: any) =>
        (cssType === "FLEX"
          ? ColorPickerStructureFlex
          : ColorPickerStructure
        ).jsonStructure(props),
      Draggable: () => (
        <DraggableComponent
          id="ColorPicker"
          icon={<IconColorFilter size={LARGE_ICON_SIZE} />}
        />
      ),
      category: "Input",
      icon: <IconColorFilter size={ICON_SIZE} />,
      synonyms: ["Color Picker", "Color Selector", "Color Swatch"],
    },
  };
};

export type ToolboxAction = {
  id: string;
  name: string;
  icon: string;
  onClick: (params: any) => void;
};

export type ComponentDefinition = {
  Component: (props: any) => any;
  modifiers: Modifiers[];
  actionTriggers: ActionTrigger[];
  sequentialTriggers: SequentialTrigger[];
  allowedParentTypes?: string[];
  toolboxActions?: ToolboxAction[];
  blockedToolboxActions?: string[];
  isValidatable?: boolean;
};

export type ComponentMapper = {
  [key: string]: ComponentDefinition;
};

export const componentMapper: ComponentMapper = {
  Avatar: {
    Component: (props) => <Avatar {...props} />,
    modifiers: ["avatar", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Badge: {
    Component: (props) => <Badge {...props} />,
    modifiers: ["badge", "spacing", "size", "border", "effects"],
    actionTriggers: [], // Triggers are not needed for this component
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Breadcrumb: {
    Component: (props) => <Breadcrumb {...props} />,
    modifiers: ["breadcrumb", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Grid: {
    Component: (props) => <Grid {...props} />,
    modifiers: ["grid", "spacing", "size", "background", "border", "effects"],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
    allowedParentTypes: ["Grid", "GridColumn", "Container", "Card"],
    toolboxActions: [
      {
        id: "add-column",
        name: "Add column",
        icon: "IconColumnInsertRight",
        onClick: addColumnToolboxAction,
      },
      {
        id: "insert-row",
        name: "Insert Row",
        icon: "IconRowInsertBottom",
        onClick: insertRowToolboxAction,
      },
    ],
    blockedToolboxActions: ["wrap-with-container"],
  },
  GridColumn: {
    Component: (props) => <GridColumn {...props} />,
    modifiers: ["gridColumn", "size", "spacing", "background", "effects"],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
    toolboxActions: [
      {
        id: "insert-grid",
        name: "Insert Grid",
        icon: "IconLayoutColumns",
        onClick: insertGridToolboxAction,
      },
      {
        id: "add-column-to-parent",
        name: "Add column",
        icon: "IconColumnInsertRight",
        onClick: addColumnToParentToolboxAction,
      },
    ],
    blockedToolboxActions: ["wrap-with-container"],
  },
  Container: {
    Component: (props) => <Container {...props} />,
    modifiers: [
      "layout",
      "background",
      "spacing",
      "size",
      "border",
      "boxShadow",
      "effects",
      "position",
    ],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Card: {
    Component: (props) => <Card {...props} />,
    modifiers: [
      "layout",
      "background",
      "spacing",
      "size",
      "border",
      "effects",
      "boxShadow",
      "position",
    ],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Select: {
    Component: (props) => <Select {...props} />,
    modifiers: ["select", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onSearchChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Input: {
    Component: (props) => <Input {...props} />,
    modifiers: ["input", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onFocus", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  DateInput: {
    Component: (props) => <DateInput {...props} />,
    modifiers: ["dateInput", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onFocus", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Text: {
    Component: (props) => <Text {...props} />,
    modifiers: ["text", "background", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Title: {
    Component: (props) => <Title {...props} />,
    modifiers: ["text", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Textarea: {
    Component: (props) => <Textarea {...props} />,
    modifiers: ["textarea", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onFocus", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Link: {
    Component: (props) => <Link {...props} />,
    modifiers: ["link", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  NavLink: {
    Component: (props) => <NavLink {...props} />,
    modifiers: ["navLink", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Icon: {
    Component: (props) => <Icon {...props} />,
    modifiers: ["icon", "spacing", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Autocomplete: {
    Component: (props) => <Autocomplete {...props} />,
    modifiers: ["autocomplete", "spacing", "size", "border", "effects"],
    actionTriggers: ["onItemSubmit", "onChange", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Progress: {
    Component: (props) => <Progress {...props} />,
    modifiers: ["progress"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  FileUpload: {
    Component: (props) => {
      return (
        <FileUpload
          {...props}
          // onDrop={(files): void => {
          //   saveFile(props.component, files);
          // }}
        />
      );
    },
    modifiers: [
      "fileButton",
      "spacing",
      "size",
      "background",
      "border",
      "effects",
    ],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  FileButton: {
    Component: (props) => (
      <FileButton
        {...props}
        // onChange={(files: any) => {
        //   saveFile(props.component, files);
        // }}
      />
    ),
    modifiers: [
      "fileButton",
      "spacing",
      "size",
      "background",
      "border",
      "effects",
    ],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  CheckboxGroup: {
    Component: (props) => <CheckboxGroup {...props} />,
    modifiers: [
      "checkboxGroup",
      "layout",
      "spacing",
      "size",
      "border",
      "effects",
    ],
    actionTriggers: ["onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Checkbox: {
    Component: (props) => <Checkbox {...props} />,
    modifiers: ["checkbox", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  CheckboxItem: {
    Component: (props) => <CheckboxItem {...props} />,
    modifiers: [
      "background",
      "layout",
      "spacing",
      "size",
      "border",
      "position",
    ],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Switch: {
    Component: (props) => <Switch {...props} />,
    modifiers: ["spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  RadioItem: {
    Component: (props) => <RadioItem {...props} />,
    modifiers: ["background", "spacing", "size", "border", "position"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Radio: {
    Component: (props) => <Radio {...props} />,
    modifiers: ["radio", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Rating: {
    Component: (props) => <Rating {...props} />,
    modifiers: ["spacing", "size", "border", "effects"],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Image: {
    Component: (props) => <Image {...props} />,
    modifiers: ["image", "spacing", "size", "border", "effects", "position"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Divider: {
    Component: (props) => <Divider {...props} />,
    modifiers: ["divider", "spacing", "size"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Pagination: {
    Component: (props) => <Pagination {...props} />,
    modifiers: ["spacing", "size", "border", "effects"],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Alert: {
    Component: (props) => <Alert {...props} />,
    modifiers: ["alert", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Tabs: {
    Component: (props) => <Tabs {...props} />,
    modifiers: ["tabs", "spacing", "size", "border", "effects"],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
    toolboxActions: [
      {
        id: "add-tab",
        name: "Add tab",
        icon: "IconColumnInsertRight",
        onClick: addTabToolboxAction,
      },
    ],
  },
  Tab: {
    Component: (props) => <Tab {...props} />,
    modifiers: ["tab", "layout", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  TabsList: {
    Component: (props) => <TabsList {...props} />,
    modifiers: ["tabsList", "layout", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  TabsPanel: {
    Component: (props) => <TabsPanel {...props} />,
    modifiers: ["tabsPanel", "spacing", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Accordion: {
    Component: (props) => <Accordion {...props} />,
    modifiers: ["accordion", "spacing", "size", "border", "effects"],
    actionTriggers: ["onOpen", "onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
    toolboxActions: [
      {
        id: "add-accordion-item",
        name: "Add Accordion Item",
        icon: "IconLayoutBottombarCollapse",
        onClick: addAccordionItemToolboxAction,
      },
    ],
  },
  AccordionItem: {
    Component: (props) => <AccordionItem {...props} />,
    modifiers: ["layout", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  AccordionControl: {
    Component: (props) => <AccordionControl {...props} />,
    modifiers: ["layout", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  AccordionPanel: {
    Component: (props) => <AccordionPanel {...props} />,
    modifiers: ["spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Navbar: {
    Component: (props) => <Navbar {...props} />,
    modifiers: ["navbar", "spacing", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  AppBar: {
    Component: (props) => <AppBar {...props} />,
    modifiers: ["layout", "background", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  BarChart: {
    Component: (props) => <BarChart {...props} />,
    modifiers: ["chart", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  LineChart: {
    Component: (props) => <LineChart {...props} />,
    modifiers: ["chart", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  PieChart: {
    Component: (props) => <PieChart {...props} />,
    modifiers: ["chart", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  AreaChart: {
    Component: (props) => <AreaChart {...props} />,
    modifiers: ["chart", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  RadarChart: {
    Component: (props) => <RadarChart {...props} />,
    modifiers: ["chart", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  RadialChart: {
    Component: (props) => <RadialChart {...props} />,
    modifiers: ["chart", "spacing", "size", "border", "effects"],
    actionTriggers: [],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Button: {
    Component: (props) => {
      return <Button {...props} />;
    },
    modifiers: [
      "button",
      "spacing",
      "border",
      "effects",
      "boxShadow",
      "position",
    ],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  CountdownButton: {
    Component: (props: { component: ComponentStructure; renderTree: any }) => {
      return (
        <CountdownButton
          component={props.component}
          renderTree={props.renderTree}
        />
      );
    },
    modifiers: [
      "countdownButton",
      "spacing",
      "border",
      "effects",
      "boxShadow",
      "position",
    ],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  ButtonIcon: {
    Component: (props) => <ButtonIcon {...props} />,
    modifiers: [
      "buttonIcon",
      "spacing",
      "size",
      "border",
      "effects",
      "position",
    ],
    actionTriggers: ["onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Form: {
    Component: (props) => <Form {...props} />,
    modifiers: ["layout", "spacing", "size", "border", "effects"],
    actionTriggers: ["onSubmit", "onReset", "onInvalid", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Modal: {
    Component: (props) => <Modal {...props} />,
    modifiers: ["modal", "spacing", "border", "effects"],
    actionTriggers: ["onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Drawer: {
    Component: (props) => <Drawer {...props} />,
    modifiers: ["drawer", "border", "effects"],
    actionTriggers: ["onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  PopOver: {
    Component: (props) => <PopOver {...props} />,
    modifiers: ["popOver", "spacing", "size", "border"],
    actionTriggers: ["onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  GoogleMap: {
    Component: (props) => <GoogleMapPlugin {...props} />,
    modifiers: ["mapSettings", "size", "border", "effects"],
    actionTriggers: ["onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  CodeEmbed: {
    Component: (props) => <CodeEmbed {...props} />,
    modifiers: ["codeEmbed", "effects"],
    actionTriggers: [],
    sequentialTriggers: [],
  },
  ColorPicker: {
    Component: (props) => <ColorPicker {...props} />,
    modifiers: ["colorPicker", "effects"],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
};
