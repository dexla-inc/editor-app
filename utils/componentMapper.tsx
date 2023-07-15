import { DraggableComponent } from "@/components/DraggableComponent";
import { Accordion } from "@/components/mapper/Accordion";
import { AccordionControl } from "@/components/mapper/AccordionControl";
import { AccordionItem } from "@/components/mapper/AccordionItem";
import { AccordionPanel } from "@/components/mapper/AccordionPanel";
import { Alert } from "@/components/mapper/Alert";
import { Avatar } from "@/components/mapper/Avatar";
import { Box } from "@/components/mapper/Box";
import { Breadcrumb } from "@/components/mapper/Breadcrumb";
import { Button } from "@/components/mapper/Button";
import { Checkbox } from "@/components/mapper/Checkbox";
import { Container } from "@/components/mapper/Container";
import { DateInput } from "@/components/mapper/DateInput";
import { FilePond } from "@/components/mapper/FilePond";
import { Flex } from "@/components/mapper/Flex";
import { Icon } from "@/components/mapper/Icon";
import { Image } from "@/components/mapper/Image";
import { Input } from "@/components/mapper/Input";
import { Link } from "@/components/mapper/Link";
import { Navbar } from "@/components/mapper/Navbar";
import { Pagination } from "@/components/mapper/Pagination";
import { Radio } from "@/components/mapper/Radio";
import { Rating } from "@/components/mapper/Rating";
import { Select } from "@/components/mapper/Select";
import { Switch } from "@/components/mapper/Switch";
import { Tab } from "@/components/mapper/Tab";
import { Table } from "@/components/mapper/Table";
import { Tabs } from "@/components/mapper/Tabs";
import { TabsList } from "@/components/mapper/TabsList";
import { TabsPanel } from "@/components/mapper/TabsPanel";
import { Text } from "@/components/mapper/Text";
import { Textarea } from "@/components/mapper/Textarea";
import { Title } from "@/components/mapper/Title";
import { Form } from "@/components/mapper/Form";
import { AreaChart } from "@/components/mapper/charts/AreaChart";
import { BarChart } from "@/components/mapper/charts/BarChart";
import { LineChart } from "@/components/mapper/charts/LineChart";
import { PieChart } from "@/components/mapper/charts/PieChart";
import { RadarChart } from "@/components/mapper/charts/RadarChart";
import * as AccordionStructure from "@/components/mapper/structure/Accordion";
import * as AccordionControlStructure from "@/components/mapper/structure/AccordionControl";
import * as AccordionItemStructure from "@/components/mapper/structure/AccordionItem";
import * as AccordionPanelStructure from "@/components/mapper/structure/AccordionPanel";
import * as AlertStructure from "@/components/mapper/structure/Alert";
import * as AppBarStructure from "@/components/mapper/structure/AppBar";
import * as AvatarStructure from "@/components/mapper/structure/Avatar";
import * as Breadcrumbs from "@/components/mapper/structure/Breadcrumb";
import * as ButtonStructure from "@/components/mapper/structure/Button";
import * as CheckboxStructure from "@/components/mapper/structure/Checkbox";
import * as ContainerStructure from "@/components/mapper/structure/Container";
import * as DateInputStructure from "@/components/mapper/structure/DateInput";
import * as FilePondStructure from "@/components/mapper/structure/FilePond";
import * as IconStructure from "@/components/mapper/structure/Icon";
import * as ImageStructure from "@/components/mapper/structure/Image";
import * as InputStructure from "@/components/mapper/structure/Input";
import * as LinkStructure from "@/components/mapper/structure/Link";
import * as NavbarStructure from "@/components/mapper/structure/Navbar";
import * as NotImplemented from "@/components/mapper/structure/NotImplemented";
import * as PaginationStructure from "@/components/mapper/structure/Pagination";
import * as RadioStructure from "@/components/mapper/structure/Radio";
import * as RatingStructure from "@/components/mapper/structure/Rating";
import * as SelectStructure from "@/components/mapper/structure/Select";
import * as SwitchStructure from "@/components/mapper/structure/Switch";
import * as TableStructure from "@/components/mapper/structure/Table";
import * as TabsStructure from "@/components/mapper/structure/Tabs";
import * as TabsListStructure from "@/components/mapper/structure/TabsList";
import * as TabsPanelStructure from "@/components/mapper/structure/TabsPanel";
import * as TextStructure from "@/components/mapper/structure/Text";
import * as TextareaStructure from "@/components/mapper/structure/Textarea";
import * as TitleStructure from "@/components/mapper/structure/Title";
import * as FormStructure from "@/components/mapper/structure/Form";
import * as AreaChartStructure from "@/components/mapper/structure/charts/AreaChart";
import * as BarChartStructure from "@/components/mapper/structure/charts/BarChart";
import * as LineChartStructure from "@/components/mapper/structure/charts/LineChart";
import * as PieChartStructure from "@/components/mapper/structure/charts/PieChart";
import * as RadarChartStructure from "@/components/mapper/structure/charts/RadarChart";
import { Component } from "@/utils/editor";
import {
  IconBrandChrome,
  IconBread,
  IconCalendar,
  IconCards,
  IconChartAreaLine,
  IconChartBar,
  IconChartLine,
  IconChartPie,
  IconChartRadar,
  IconCheckbox,
  IconClick,
  IconContainer,
  IconCursorText,
  IconExclamationMark,
  IconFile,
  IconFileText,
  IconForms,
  IconHeading,
  IconJewishStar,
  IconLayersDifference,
  IconLayoutBottombarCollapse,
  IconLayoutKanban,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconLink,
  IconListCheck,
  IconPageBreak,
  IconPhoto,
  IconPhotoSearch,
  IconPictureInPicture,
  IconPlaystationCircle,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconSelect,
  IconTable,
  IconToggleLeft,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { FileWithPath } from "file-selector";
import { ICON_SIZE, LARGE_ICON_SIZE } from "./config";

export type ComponentCategoryType =
  | "Layout"
  | "Input"
  | "Typography"
  | "Navigation"
  | "Data Display"
  | "Feedback"
  | "Card"
  | "Chart";

export type StructureDefinition = {
  structure: (props: any) => Component;
  Draggable?: any;
  category: ComponentCategoryType;
  icon?: JSX.Element;
};

export type StructureMapper = {
  [key: string]: StructureDefinition;
};

export const structureMapper: StructureMapper = {
  // AI generated structures

  Container: {
    structure: (props: any) => ContainerStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Container"
        icon={<IconContainer size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Layout",
    icon: <IconContainer size={ICON_SIZE} />,
  },

  Input: {
    structure: (props: any) => InputStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Input"
        icon={<IconFileText size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconFileText size={ICON_SIZE} />,
  },
  Select: {
    structure: (props: any) => SelectStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Select"
        icon={<IconSelect size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconSelect size={ICON_SIZE} />,
  },

  Button: {
    structure: (props: any) => ButtonStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Button"
        icon={<IconClick size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconClick size={ICON_SIZE} />,
  },
  Link: {
    structure: (props: any) => LinkStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Link"
        icon={<IconLink size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconLink size={ICON_SIZE} />,
  },

  Radio: {
    structure: (props: any) => RadioStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Radio"
        icon={<IconPlaystationCircle size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconPlaystationCircle size={ICON_SIZE} />,
  },
  Checkbox: {
    structure: (props: any) => CheckboxStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Checkbox"
        icon={<IconCheckbox size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconCheckbox size={ICON_SIZE} />,
  },

  Form: {
    structure: (props: any) => FormStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Form"
        icon={<IconForms size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconForms size={ICON_SIZE} />,
  },
  StepperForm: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Input",
  },
  DateInput: {
    structure: (props: any) => DateInputStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="DateInput"
        icon={<IconCalendar size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconCalendar size={ICON_SIZE} />,
  },
  Textarea: {
    structure: (props: any) => TextareaStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Textarea"
        icon={<IconPictureInPicture size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconPictureInPicture size={ICON_SIZE} />,
  },
  Switch: {
    structure: (props: any) => SwitchStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Switch"
        icon={<IconToggleLeft size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconToggleLeft size={ICON_SIZE} />,
  },
  Rating: {
    structure: (props: any) => RatingStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Rating"
        icon={<IconJewishStar size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconJewishStar size={ICON_SIZE} />,
  },
  FilePond: {
    structure: (props: any) => FilePondStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="FilePond"
        icon={<IconFile size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconFile size={ICON_SIZE} />,
  },
  Text: {
    structure: (props: any) => TextStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Text"
        icon={<IconCursorText size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Typography",
    icon: <IconCursorText size={ICON_SIZE} />,
  },
  Title: {
    structure: (props: any) => TitleStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Title"
        icon={<IconHeading size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Typography",
    icon: <IconHeading size={ICON_SIZE} />,
  },
  Table: {
    structure: (props: any) => TableStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Table"
        icon={<IconTable size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconTable size={ICON_SIZE} />,
  },
  Icon: {
    structure: (props: any) => IconStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Icon"
        icon={<IconBrandChrome size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconBrandChrome size={ICON_SIZE} />,
  },
  Image: {
    structure: (props: any) => ImageStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Image"
        icon={<IconPhoto size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconPhoto size={ICON_SIZE} />,
  },
  CodeSnippet: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Data Display",
  },
  Newsfeed: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Data Display",
  },
  CardList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="CardList"
        icon={<IconCards size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconCards size={ICON_SIZE} />,
  },
  TaskList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="TaskList"
        icon={<IconListCheck size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconListCheck size={ICON_SIZE} />,
  },
  ProfileList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="ProfileList"
        icon={<IconUsers size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconUsers size={ICON_SIZE} />,
  },
  Avatar: {
    structure: (props: any) => AvatarStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Avatar"
        icon={<IconUser size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconUser size={ICON_SIZE} />,
  },
  List: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Data Display",
  },
  TabsList: {
    structure: (props: any) => TabsListStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="TabsList"
        icon={<IconLayersDifference size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconLayersDifference size={ICON_SIZE} />,
  },
  TabsPanel: {
    structure: (props: any) => TabsPanelStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="TabsPanel"
        icon={<IconLayersDifference size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconLayersDifference size={ICON_SIZE} />,
  },
  Accordion: {
    structure: (props: any) => AccordionStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Accordion"
        icon={<IconLayoutBottombarCollapse size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconLayoutBottombarCollapse size={ICON_SIZE} />,
  },
  AccordionItem: {
    structure: (props: any) => AccordionItemStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="AccordionItem"
        icon={<IconLayoutBottombarCollapse size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconLayoutBottombarCollapse size={ICON_SIZE} />,
  },
  AccordionControl: {
    structure: (props: any) => AccordionControlStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="AccordionControl"
        icon={<IconRowInsertTop size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconRowInsertTop size={ICON_SIZE} />,
  },
  Navbar: {
    structure: (props: any) => NavbarStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Navbar"
        icon={<IconLayoutSidebar size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconLayoutSidebar size={ICON_SIZE} />,
  },
  Pagination: {
    structure: (props: any) => PaginationStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Pagination"
        icon={<IconPageBreak size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconPageBreak size={ICON_SIZE} />,
  },
  AccordionPanel: {
    structure: (props: any) => AccordionPanelStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="AccordionPanel"
        icon={<IconRowInsertBottom size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconRowInsertBottom size={ICON_SIZE} />,
  },
  Breadcrumb: {
    structure: (props: any) => Breadcrumbs.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Breadcrumb"
        icon={<IconBread size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconBread size={ICON_SIZE} />,
  },
  AppBar: {
    structure: (props: any) => AppBarStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="AppBar"
        icon={<IconLayoutNavbar size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconLayoutNavbar size={ICON_SIZE} />,
  },
  Carousel: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Navigation",
  },

  Card: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Card",
  },
  ProgressCard: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Card",
  },
  ImageCard: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Card",
  },
  ProfileCard: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Card",
  },
  BarChart: {
    structure: (props: any) => BarChartStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="BarChart"
        icon={<IconChartBar size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Chart",
    icon: <IconChartBar size={ICON_SIZE} />,
  },
  StackedBarChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  RadialBarChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  MixBarChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  ScatterChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  LineChart: {
    structure: (props: any) => LineChartStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="LineChart"
        icon={<IconChartLine size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Chart",
    icon: <IconChartLine size={ICON_SIZE} />,
  },
  PieChart: {
    structure: (props: any) => PieChartStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="PieChart"
        icon={<IconChartPie size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Chart",
    icon: <IconChartPie size={ICON_SIZE} />,
  },
  AreaChart: {
    structure: (props: any) => AreaChartStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="AreaChart"
        icon={<IconChartAreaLine size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Chart",
    icon: <IconChartAreaLine size={ICON_SIZE} />,
  },
  ComposedChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  StackedAreaChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  PercentAreaChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    category: "Chart",
  },
  RadarChart: {
    structure: (props: any) => RadarChartStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="RadarChart"
        icon={<IconChartRadar size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Chart",
    icon: <IconChartRadar size={ICON_SIZE} />,
  },

  ImageCardList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="ImageCardList"
        icon={<IconPhotoSearch size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Card",
    icon: <IconPhotoSearch size={ICON_SIZE} />,
  },

  Alert: {
    structure: (props: any) => AlertStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Alert"
        icon={<IconExclamationMark size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Feedback",
    icon: <IconExclamationMark size={ICON_SIZE} />,
  },
  Tabs: {
    structure: (props: any) => TabsStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Tabs"
        icon={<IconLayoutKanban size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconLayoutKanban size={ICON_SIZE} />,
  },
};

export type Modifiers =
  | "spacing"
  | "size"
  | "text"
  | "border"
  | "layout"
  | "background"
  | "input"
  | "button"
  | "title";

export type ComponentDefinition = {
  Component: any;
  modifiers: Modifiers[];
};

export type ComponentMapper = {
  [key: string]: ComponentDefinition;
};

export const componentMapper: ComponentMapper = {
  Avatar: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Avatar component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Box: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Box component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Breadcrumb: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Breadcrumb
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Flex: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Flex component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Container: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Container component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["layout", "spacing", "size", "border", "background"],
  },
  Select: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Select
        component={props.component}
        renderTree={props.renderTree}
        data={["Option 1", "Option 2"]}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Input: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Input component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border", "input"],
  },
  DateInput: {
    Component: (props: { component: Component; renderTree: any }) => (
      <DateInput
        component={props.component}
        renderTree={props.renderTree}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Text: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Text component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "text"],
  },
  Title: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Title component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "title"],
  },
  Textarea: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Textarea component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Link: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Link component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Icon: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Icon component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Table: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Table component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  FilePond: {
    Component: (props: { component: Component; renderTree: any }) => (
      <FilePond
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        onDrop={(files: FileWithPath[]): void => {
          console.log("Function not implemented.");
        }}
        activateOnClick={false}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Checkbox: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Checkbox
        component={props.component}
        renderTree={props.renderTree}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Switch: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Switch
        component={props.component}
        renderTree={props.renderTree}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Radio: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Radio
        component={props.component}
        renderTree={props.renderTree}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Rating: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Rating
        component={props.component}
        renderTree={props.renderTree}
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Image: {
    Component: (props: { component: Component; renderTree: any }) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Pagination: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Pagination
        component={props.component}
        renderTree={props.renderTree}
        total={10}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Alert: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Alert
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Tabs: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Tabs
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  TabsList: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TabsList
        component={props.component}
        renderTree={props.renderTree}
        defaultValue="first"
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  TabsPanel: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TabsPanel
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        value="first"
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Tab: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Tab
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        value="first"
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Accordion: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Accordion
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        defaultValue="first"
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  AccordionItem: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AccordionItem
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        value="first"
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  AccordionControl: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AccordionControl
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  AccordionPanel: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AccordionPanel
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Navbar: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Navbar
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  BarChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <BarChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  LineChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <LineChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  PieChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <PieChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  AreaChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AreaChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  RadarChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <RadarChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "border"],
  },
  Button: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Button
        component={props.component}
        renderTree={props.renderTree}
        // @ts-ignore
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: ["spacing", "size", "border", "button"],
  },
  Form: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Form component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["layout", "spacing", "size", "border"],
  },
};
