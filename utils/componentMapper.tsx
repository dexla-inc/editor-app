import { DraggableComponent } from "@/components/DraggableComponent";
import { Accordion } from "@/components/mapper/Accordion";
import { AccordionControl } from "@/components/mapper/AccordionControl";
import { AccordionItem } from "@/components/mapper/AccordionItem";
import { AccordionPanel } from "@/components/mapper/AccordionPanel";
import { Alert } from "@/components/mapper/Alert";
import { AppBar } from "@/components/mapper/AppBar";
import { Avatar } from "@/components/mapper/Avatar";
import { Badge } from "@/components/mapper/Badge";
import { Breadcrumb } from "@/components/mapper/Breadcrumb";
import { Button } from "@/components/mapper/Button";
import { ButtonIcon } from "@/components/mapper/ButtonIcon";
import { Card } from "@/components/mapper/Card";
import { Checkbox } from "@/components/mapper/Checkbox";
import { Container } from "@/components/mapper/Container";
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
import { Radio } from "@/components/mapper/Radio";
import { RadioItem } from "@/components/mapper/RadioItem";
import { Rating } from "@/components/mapper/Rating";
import { Select } from "@/components/mapper/Select";
import { Stepper } from "@/components/mapper/Stepper";
import { Switch } from "@/components/mapper/Switch";
import { Tab } from "@/components/mapper/Tab";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/mapper/Table2/Table";
import { Tabs } from "@/components/mapper/Tabs";
import { Text } from "@/components/mapper/Text";
import { Textarea } from "@/components/mapper/Textarea";
import { Title } from "@/components/mapper/Title";
import { AreaChart } from "@/components/mapper/charts/AreaChart";
import { BarChart } from "@/components/mapper/charts/BarChart";
import { LineChart } from "@/components/mapper/charts/LineChart";
import { PieChart } from "@/components/mapper/charts/PieChart";
import { RadarChart } from "@/components/mapper/charts/RadarChart";
import * as AccordionStructure from "@/components/mapper/structure/Accordion";
import * as AlertStructure from "@/components/mapper/structure/Alert";
import * as AppBarStructure from "@/components/mapper/structure/AppBar";
import * as AvatarStructure from "@/components/mapper/structure/Avatar";
import * as BadgeStructure from "@/components/mapper/structure/Badge";
import * as Breadcrumbs from "@/components/mapper/structure/Breadcrumb";
import * as ButtonStructure from "@/components/mapper/structure/Button";
import * as ButtonIconStructure from "@/components/mapper/structure/ButtonIcon";
import * as CardStructure from "@/components/mapper/structure/Card";
import * as CheckboxStructure from "@/components/mapper/structure/Checkbox";
import * as ContainerStructure from "@/components/mapper/structure/Container";
import * as DateInputStructure from "@/components/mapper/structure/DateInput";
import * as DividerStructure from "@/components/mapper/structure/Divider";
import * as DrawerStructure from "@/components/mapper/structure/Drawer";
import * as FileButtonStructure from "@/components/mapper/structure/FileButton";
import * as FileUploadStructure from "@/components/mapper/structure/FileUpload";
import * as FormStructure from "@/components/mapper/structure/Form";
import * as MapStructure from "@/components/mapper/structure/GoogleMap";
import * as GridStructure from "@/components/mapper/structure/Grid";
import * as GridColumnStructure from "@/components/mapper/structure/GridColumn";
import * as IconStructure from "@/components/mapper/structure/Icon";
import * as ImageStructure from "@/components/mapper/structure/Image";
import * as InputStructure from "@/components/mapper/structure/Input";
import * as LinkStructure from "@/components/mapper/structure/Link";
import * as ModalStructure from "@/components/mapper/structure/Modal";
import * as NavLinkStructure from "@/components/mapper/structure/NavLink";
import * as NavbarStructure from "@/components/mapper/structure/Navbar";
import * as PaginationStructure from "@/components/mapper/structure/Pagination";
import * as PopOverStructure from "@/components/mapper/structure/PopOver";
import * as RadioGroupStructure from "@/components/mapper/structure/RadioGroup";
import * as RatingStructure from "@/components/mapper/structure/Rating";
import * as SelectStructure from "@/components/mapper/structure/Select";
import * as StepperStructure from "@/components/mapper/structure/Stepper";
import * as StepperStepStructure from "@/components/mapper/structure/StepperStep";
import * as SwitchStructure from "@/components/mapper/structure/Switch";
import * as TabsStructure from "@/components/mapper/structure/Tabs";
import * as TextStructure from "@/components/mapper/structure/Text";
import * as TextareaStructure from "@/components/mapper/structure/Textarea";
import * as TitleStructure from "@/components/mapper/structure/Title";
import * as AreaChartStructure from "@/components/mapper/structure/charts/AreaChart";
import * as BarChartStructure from "@/components/mapper/structure/charts/BarChart";
import * as LineChartStructure from "@/components/mapper/structure/charts/LineChart";
import * as PieChartStructure from "@/components/mapper/structure/charts/PieChart";
import * as RadarChartStructure from "@/components/mapper/structure/charts/RadarChart";
import * as RadialChartStructure from "@/components/mapper/structure/charts/RadialChart";
import * as TableStructure from "@/components/mapper/structure/table/Table";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";

import { FileButton } from "@/components/mapper/FileButton";
import { TabsList } from "@/components/mapper/TabsList";
import { TabsPanel } from "@/components/mapper/TabsPanel";
import { RadialChart } from "@/components/mapper/charts/RadialChart";
import { uploadFile } from "@/requests/storage/mutations";
import { useEditorStore } from "@/stores/editor";
import { ActionTrigger, SequentialTrigger } from "@/utils/actions";
import { Modifiers } from "@/utils/modifiers";

import {
  IconArrowAutofitContent,
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
  IconContainer,
  IconCursorText,
  IconExclamationMark,
  IconFile,
  IconFileText,
  IconFileUpload,
  IconForms,
  IconHeading,
  IconIdBadge,
  IconJewishStar,
  IconLayoutBottombarCollapse,
  IconLayoutColumns,
  IconLayoutGrid,
  IconLayoutKanban,
  IconLayoutNavbar,
  IconLayoutSidebar,
  IconLayoutSidebarLeftCollapse,
  IconLink,
  IconMapPin,
  IconPageBreak,
  IconPhoto,
  IconPictureInPicture,
  IconSelect,
  IconSeparator,
  IconSlash,
  IconStackPop,
  IconTable,
  IconToggleLeft,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";

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
  | "Third Party";

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
  },
  GridColumn: {
    structure: (props: any) => GridColumnStructure.jsonStructure(props),
    category: "Layout",
    icon: <IconLayoutColumns size={ICON_SIZE} />,
  },
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

  Card: {
    structure: (props: any) => CardStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Card"
        icon={<IconBoxModel size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Layout",
    icon: <IconBoxModel size={ICON_SIZE} />,
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
  RadioGroup: {
    structure: (props: any) => RadioGroupStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="RadioGroup"
        icon={<IconCircleDot size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconCircleDot size={ICON_SIZE} />,
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
  ButtonIcon: {
    structure: (props: any) => ButtonIconStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="ButtonIcon"
        icon={<IconCircleDot size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconCircleDot size={ICON_SIZE} />,
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
  FileButton: {
    structure: (props: any) => FileButtonStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="FileButton"
        icon={<IconFileUpload size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconFileUpload size={ICON_SIZE} />,
  },
  FileUpload: {
    structure: (props: any) => FileUploadStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="FileUpload"
        icon={<IconFile size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Input",
    icon: <IconFile size={ICON_SIZE} />,
  },
  // RadioItem: {
  //   structure: (props: any) => RadioItemStructure.jsonStructure(props),
  //   category: "Input",
  //   Draggable: () => (
  //     <DraggableComponent
  //       id="RadioItem"
  //       icon={<IconCircleDot size={LARGE_ICON_SIZE} />}
  //     />
  //   ),
  //   icon: <IconCircleDot size={ICON_SIZE} />,
  // },
  // RadioItemComplex: {
  //   structure: (props: any) => RadioItemComplexStructure.jsonStructure(props),
  //   category: "Input",
  //   Draggable: () => (
  //     <DraggableComponent
  //       id="RadioItemComplex"
  //       icon={<IconCircleDotFilled size={LARGE_ICON_SIZE} />}
  //     />
  //   ),
  //   icon: <IconCircleDotFilled size={ICON_SIZE} />,
  // },
  // RadioGroupComplex: {
  //   structure: (props: any) => RadioComplexGroupStructure.jsonStructure(props),
  //   Draggable: () => (
  //     <DraggableComponent
  //       id="RadioGroupComplex"
  //       icon={<IconCirclesFilled size={LARGE_ICON_SIZE} />}
  //     />
  //   ),
  //   category: "Input",
  //   icon: <IconCirclesFilled size={ICON_SIZE} />,
  // },
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
  // CodeSnippet: {
  //   structure: (props: any) => NotImplemented.jsonStructure(props),
  //   category: "Data Display",
  // },
  Divider: {
    structure: (props: any) => DividerStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Divider"
        icon={<IconSeparator size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconSeparator size={ICON_SIZE} />,
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
  Alert: {
    structure: (props: any) => AlertStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Alert"
        icon={<IconExclamationMark size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Data Display",
    icon: <IconExclamationMark size={ICON_SIZE} />,
  },
  // List: {
  //   structure: (props: any) => NotImplemented.jsonStructure(props),
  //   category: "Data Display",
  // },
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
  NavLink: {
    structure: (props: any) => NavLinkStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="NavLink"
        icon={<IconClick size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconClick size={ICON_SIZE} />,
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
  Breadcrumb: {
    structure: (props: any) => Breadcrumbs.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Breadcrumb"
        icon={<IconSlash size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconSlash size={ICON_SIZE} />,
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
  Stepper: {
    structure: (props: any) => StepperStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Stepper"
        icon={<IconArrowAutofitContent size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Navigation",
    icon: <IconArrowAutofitContent size={ICON_SIZE} />,
  },
  StepperStep: {
    structure: (props: any) => StepperStepStructure.jsonStructure(props),
    category: "Navigation",
    icon: <IconArrowAutofitContent size={ICON_SIZE} />,
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
  RadialChart: {
    structure: (props: any) => RadialChartStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="RadialChart"
        icon={<IconChartArcs size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Chart",
    icon: <IconChartDonut size={ICON_SIZE} />,
  },
  Badge: {
    structure: (props: any) => BadgeStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Badge"
        icon={<IconIdBadge size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Feedback",
    icon: <IconIdBadge size={ICON_SIZE} />,
  },
  Modal: {
    structure: (props: any) => ModalStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Modal"
        icon={<IconBoxModel size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Overlays",
    icon: <IconBoxModel size={ICON_SIZE} />,
  },
  Drawer: {
    structure: (props: any) => DrawerStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="Drawer"
        icon={<IconLayoutSidebarLeftCollapse size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Overlays",
    icon: <IconLayoutSidebarLeftCollapse size={ICON_SIZE} />,
  },
  PopOver: {
    structure: (props: any) => PopOverStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="PopOver"
        icon={<IconStackPop size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Overlays",
    icon: <IconStackPop size={ICON_SIZE} />,
  },
  GoogleMap: {
    structure: (props: any) => MapStructure.jsonStructure(props),
    Draggable: () => (
      <DraggableComponent
        id="GoogleMap"
        icon={<IconMapPin size={LARGE_ICON_SIZE} />}
      />
    ),
    category: "Third Party",
    icon: <IconMapPin size={ICON_SIZE} />,
  },
};

export type ComponentDefinition = {
  Component: any;
  modifiers: Modifiers[];
  actionTriggers: ActionTrigger[];
  sequentialTriggers: SequentialTrigger[];
  allowedParentTypes?: string[];
  // TODO: Add actions: Action[]. Filter all possible actions for a component
};

export type ComponentMapper = {
  [key: string]: ComponentDefinition;
};

export const componentMapper: ComponentMapper = {
  Avatar: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Avatar component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["avatar", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Badge: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Badge component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["badge", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["breadcrumb", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Stepper: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Stepper
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        active={1}
      />
    ),
    modifiers: ["stepper", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Grid: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Grid component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["grid", "spacing", "background", "border", "effects"],
    actionTriggers: ["onMount", "onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
    allowedParentTypes: ["Grid", "GridColumn"],
  },
  GridColumn: {
    Component: (props: { component: Component; renderTree: any }) => (
      <GridColumn component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["gridColumn", "spacing", "background", "effects"],
    actionTriggers: ["onMount", "onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Container: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Container component={props.component} renderTree={props.renderTree} />
    ),
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
    actionTriggers: ["onMount", "onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },

  Card: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Card component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [
      "layout",
      "background",
      "spacing",
      "size",
      "effects",
      "border",
      "boxShadow",
    ],
    actionTriggers: ["onMount", "onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["select", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Input: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Input component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["input", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange", "onFocus", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["dateInput", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange", "onFocus", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Text: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Text component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["text", "background", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Title: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Title component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["text", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Textarea: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Textarea component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["textarea", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange", "onFocus", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Link: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Link component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["link", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  NavLink: {
    Component: (props: { component: Component; renderTree: any }) => (
      <NavLink component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["navLink", "background", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Icon: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Icon component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["icon", "spacing", "effects", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Table: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Table component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["table", "spacing", "size", "border"],
    actionTriggers: [
      "onMount",
      "onRowClick",
      "onRowHover",
      "onRowSelect",
      "onRowExpand",
      "onSort",
      "onFilterApplied",
    ],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  TableHead: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TableHead component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [],
    actionTriggers: [],
    sequentialTriggers: [],
  },
  TableBody: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TableBody component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [],
    actionTriggers: [],
    sequentialTriggers: [],
  },
  TableRow: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TableRow component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [],
    actionTriggers: [],
    sequentialTriggers: [],
  },
  TableCell: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TableCell component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [],
    actionTriggers: [],
    sequentialTriggers: [],
  },
  TableHeaderCell: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TableHeaderCell
        component={props.component}
        renderTree={props.renderTree}
      />
    ),
    modifiers: [],
    actionTriggers: [],
    sequentialTriggers: [],
  },
  FileUpload: {
    Component: (props: { component: Component; renderTree: any }) => {
      const router = useRouter();
      const projectId = router.query.id as string;
      return (
        <FileUpload
          component={props.component}
          renderTree={props.renderTree}
          // eslint-disable-next-line react/no-children-prop
          children={props.component.children as any}
          onDrop={(files): void => {
            uploadFile(projectId, files, props.component.props?.multiple);
          }}
          activateOnClick={false}
          dragEventsBubbling={false}
          activateOnDrag={true}
        />
      );
    },
    modifiers: ["fileButton", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  FileButton: {
    Component: (props: { component: Component; renderTree: any }) => (
      // @ts-ignore
      <FileButton
        onChange={(files) => {
          const updateTreeComponent =
            useEditorStore.getState().updateTreeComponent;
          updateTreeComponent({
            componentId: props.component.id!,
            props: files,
          });
        }}
        component={props.component}
        renderTree={props.renderTree}
      />
    ),
    modifiers: ["fileButton", "spacing", "size", "background", "border"],
    actionTriggers: ["onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Checkbox: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Checkbox component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["checkbox", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    actionTriggers: ["onMount", "onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  RadioItem: {
    Component: (props: { component: Component; renderTree: any }) => (
      // @ts-ignore
      <RadioItem component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [
      "radioItem",
      "background",
      "spacing",
      "size",
      "border",
      "position",
    ],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Radio: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Radio
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["radio", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    actionTriggers: ["onMount", "onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Image: {
    Component: (props: { component: Component; renderTree: any }) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["image", "effects", "spacing", "size", "border", "position"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Divider: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Divider component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["divider", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    actionTriggers: ["onMount", "onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["alert", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["tabs", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onChange"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["tab", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  TabsList: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TabsList
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
      />
    ),
    modifiers: ["tabsList", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  TabsPanel: {
    Component: (props: { component: Component; renderTree: any }) => (
      <TabsPanel
        component={props.component}
        renderTree={props.renderTree}
        // eslint-disable-next-line react/no-children-prop
        children={props.component.children as any}
        value={props.component.props?.value as any}
      />
    ),
    modifiers: ["tabsPanel", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["accordion", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onOpen", "onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["accordionItem", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
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
    modifiers: ["navbar", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  AppBar: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AppBar component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["layout", "background", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  BarChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <BarChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["chart", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  LineChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <LineChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["chart", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  PieChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <PieChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["chart", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  AreaChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AreaChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["chart", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  RadarChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <RadarChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["chart", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  RadialChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <RadialChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["chart", "spacing", "size", "border"],
    actionTriggers: ["onMount"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Button: {
    Component: (props: { component: Component; renderTree: any }) => (
      // @ts-ignore
      <Button component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: [
      "button",
      "spacing",
      "border",
      "boxShadow",
      "effects",
      "position",
    ],
    actionTriggers: ["onMount", "onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  ButtonIcon: {
    Component: (props: { component: Component; renderTree: any }) => (
      <ButtonIcon
        component={props.component}
        renderTree={props.renderTree}
        // @ts-ignore
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    ),
    modifiers: [
      "buttonIcon",
      "spacing",
      "size",
      "effects",
      "border",
      "position",
    ],
    actionTriggers: ["onMount", "onClick", "onHover"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Form: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Form component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["layout", "spacing", "size", "border"],
    actionTriggers: ["onMount", "onSubmit", "onReset", "onInvalid", "onBlur"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Modal: {
    Component: (props: { component: Component; renderTree: any }) => (
      // @ts-ignore
      <Modal component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["modal", "border"],
    actionTriggers: ["onMount", "onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  Drawer: {
    Component: (props: { component: Component; renderTree: any }) => (
      // @ts-ignore
      <Drawer component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["drawer", "border"],
    actionTriggers: ["onMount", "onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  PopOver: {
    Component: (props: { component: Component; renderTree: any }) => (
      // @ts-ignore
      <PopOver component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["popOver", "border"],
    actionTriggers: ["onMount", "onClose"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
  GoogleMap: {
    Component: (props: { component: Component; renderTree: any }) => (
      <GoogleMapPlugin
        component={props.component}
        renderTree={props.renderTree}
      />
    ),
    modifiers: ["mapSettings", "size", "border"],
    actionTriggers: ["onMount", "onClick"],
    sequentialTriggers: ["onSuccess", "onError"],
  },
};
