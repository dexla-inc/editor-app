import { Component } from "@/utils/editor";
import * as AppBarStructure from "@/components/mapper/structure/AppBar";
import * as NotImplemented from "@/components/mapper/structure/NotImplemented";
import * as TextStructure from "@/components/mapper/structure/Text";
import * as AvatarStructure from "@/components/mapper/structure/Avatar";
import * as TextareaStructure from "@/components/mapper/structure/Textarea";
import * as ContainerStructure from "@/components/mapper/structure/Container";
import * as SelectStructure from "@/components/mapper/structure/Select";
import * as InputStructure from "@/components/mapper/structure/Input";
import * as ButtonStructure from "@/components/mapper/structure/Button";
import * as LinkStructure from "@/components/mapper/structure/Link";
import * as BarChartStructure from "@/components/mapper/structure/charts/BarChart";
import * as LineChartStructure from "@/components/mapper/structure/charts/LineChart";
import * as PieChartStructure from "@/components/mapper/structure/charts/PieChart";
import * as AreaChartStructure from "@/components/mapper/structure/charts/AreaChart";
import * as RadarChartStructure from "@/components/mapper/structure/charts/RadarChart";
import * as IconStructure from "@/components/mapper/structure/Icon";
import * as NavbarStructure from "@/components/mapper/structure/Navbar";
import * as TableStructure from "@/components/mapper/structure/Table";
import * as CheckboxStructure from "@/components/mapper/structure/Checkbox";
import * as SwitchStructure from "@/components/mapper/structure/Switch";
import * as RadioStructure from "@/components/mapper/structure/Radio";
import * as RatingStructure from "@/components/mapper/structure/Rating";
import * as DateInputStructure from "@/components/mapper/structure/DateInput";
import * as ImageStructure from "@/components/mapper/structure/Image";
import * as PaginationStructure from "@/components/mapper/structure/Pagination";
import * as AlertStructure from "@/components/mapper/structure/Alert";
import * as Breadcrumbs from "@/components/mapper/structure/Breadcrumb";
import { Box } from "@/components/mapper/Box";
import { Avatar } from "@/components/mapper/Avatar";
import { Text } from "@/components/mapper/Text";
import { Flex } from "@/components/mapper/Flex";
import { Container } from "@/components/mapper/Container";
import { Breadcrumb } from "@/components/mapper/Breadcrumb";
import { DraggableComponent } from "@/components/DraggableComponent";
import { Select } from "@/components/mapper/Select";
import { Input } from "@/components/mapper/Input";
import { Button } from "@/components/mapper/Button";
import { Link } from "@/components/mapper/Link";
import { Textarea } from "@/components/mapper/Textarea";
import { Icon } from "@/components/mapper/Icon";
import { Navbar } from "@/components/mapper/Navbar";
import { Table } from "@/components/mapper/Table";
import { Checkbox } from "@/components/mapper/Checkbox";
import { Switch } from "@/components/mapper/Switch";
import { Radio } from "@/components/mapper/Radio";
import { Rating } from "@/components/mapper/Rating";
import { DateInput } from "@/components/mapper/DateInput";
import { Image } from "@/components/mapper/Image";
import { Alert } from "@/components/mapper/Alert";
import { Pagination } from "@/components/mapper/Pagination";
import { BarChart } from "@/components/mapper/charts/BarChart";
import { LineChart } from "@/components/mapper/charts/LineChart";
import { PieChart } from "@/components/mapper/charts/PieChart";
import { AreaChart } from "@/components/mapper/charts/AreaChart";
import { RadarChart } from "@/components/mapper/charts/RadarChart";

export type StructureDefinition = {
  structure: (props: any) => Component;
  Draggable?: any;
};

export type StructureMapper = {
  [key: string]: StructureDefinition;
};

export const structureMapper: StructureMapper = {
  // AI generated structures
  Breadcrumb: {
    structure: (props: any) => Breadcrumbs.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Breadcrumb" />,
  },
  AppBar: {
    structure: (props: any) => AppBarStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="AppBar" />,
  },
  Accordion: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  Carousel: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  Form: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  Table: {
    structure: (props: any) => TableStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Table" />,
  },
  StepperForm: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  CodeSnippet: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  ProgressCard: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  ImageCard: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  ProfileCard: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  BarChart: {
    structure: (props: any) => BarChartStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="BarChart" />,
  },
  StackedBarChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  RadialBarChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  MixBarChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  ScatterChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  LineChart: {
    structure: (props: any) => LineChartStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="LineChart" />,
  },
  PieChart: {
    structure: (props: any) => PieChartStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="PieChart" />,
  },
  AreaChart: {
    structure: (props: any) => AreaChartStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="AreaChart" />,
  },
  ComposedChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  StackedAreaChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  PercentAreaChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  RadarChart: {
    structure: (props: any) => RadarChartStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="RadarChart" />,
  },
  Newsfeed: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  FilePond: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  CardList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  TaskList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  ProfileList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  ImageCardList: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  // Primitives you can add to the canvas
  Text: {
    structure: (props: any) => TextStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Text" />,
  },
  Avatar: {
    structure: (props: any) => AvatarStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Avatar" />,
  },
  Container: {
    structure: (props: any) => ContainerStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Container" />,
  },
  Select: {
    structure: (props: any) => SelectStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Select" />,
  },
  Input: {
    structure: (props: any) => InputStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Input" />,
  },
  DateInput: {
    structure: (props: any) => DateInputStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="DateInput" />,
  },
  Textarea: {
    structure: (props: any) => TextareaStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Textarea" />,
  },
  Button: {
    structure: (props: any) => ButtonStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Button" />,
  },
  Link: {
    structure: (props: any) => LinkStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Link" />,
  },
  Icon: {
    structure: (props: any) => IconStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Icon" />,
  },
  Navbar: {
    structure: (props: any) => NavbarStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Navbar" />,
  },
  Checkbox: {
    structure: (props: any) => CheckboxStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Checkbox" />,
  },
  Switch: {
    structure: (props: any) => SwitchStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Switch" />,
  },
  Radio: {
    structure: (props: any) => RadioStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Radio" />,
  },
  Rating: {
    structure: (props: any) => RatingStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Rating" />,
  },
  Image: {
    structure: (props: any) => ImageStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Image" />,
  },
  Pagination: {
    structure: (props: any) => PaginationStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Pagination" />,
  },
  Alert: {
    structure: (props: any) => AlertStructure.jsonStructure(props),
    Draggable: () => <DraggableComponent id="Alert" />,
  },
};

export type Modifiers = "spacing" | "size" | "text";

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
    modifiers: ["spacing", "size"],
  },
  Box: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Box component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
  },
  Flex: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Flex component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Container: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Container component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
  },
  Input: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Input component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
  },
  Text: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Text component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "text"],
  },
  Textarea: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Textarea component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Link: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Link component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Icon: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Icon component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Table: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Table component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
  },
  Image: {
    Component: (props: { component: Component; renderTree: any }) => (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Pagination: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Pagination
        component={props.component}
        renderTree={props.renderTree}
        total={10}
      />
    ),
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
  },
  BarChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <BarChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  LineChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <LineChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  PieChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <PieChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  AreaChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <AreaChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  RadarChart: {
    Component: (props: { component: Component; renderTree: any }) => (
      <RadarChart component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
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
    modifiers: ["spacing", "size"],
  },
};
