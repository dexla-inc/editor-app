import { Component } from "@/utils/editor";
import * as AppBarStructure from "@/components/mapper/structure/AppBar";
import * as NotImplemented from "@/components/mapper/structure/NotImplemented";
import * as TextStructure from "@/components/mapper/structure/Text";
import * as Breadcrumbs from "@/components/mapper/structure/Breadcrumb";
import { Box } from "@/components/mapper/Box";
import { Avatar } from "@/components/mapper/Avatar";
import { Text } from "@/components/mapper/Text";
import { Group } from "@/components/mapper/Group";
import { Flex } from "@/components/mapper/Flex";
import { Container } from "@/components/mapper/Container";
import { Stack } from "@/components/mapper/Stack";
import { Breadcrumb } from "@/components/mapper/Breadcrumb";

export type StructureDefinition = {
  structure: (props: any) => Component;
};

export type StructureMapper = {
  [key: string]: StructureDefinition;
};

export const structureMapper: StructureMapper = {
  // AI generated structures
  Breadcrumb: {
    structure: (props: any) => Breadcrumbs.jsonStructure(props),
  },
  AppBar: { structure: (props: any) => AppBarStructure.jsonStructure(props) },
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
    structure: (props: any) => NotImplemented.jsonStructure(props),
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
    structure: (props: any) => NotImplemented.jsonStructure(props),
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
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  PieChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  AreaChart: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
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
    structure: (props: any) => NotImplemented.jsonStructure(props),
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
  Group: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Group component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Stack: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Stack component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size"],
  },
  Text: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Text component={props.component} renderTree={props.renderTree} />
    ),
    modifiers: ["spacing", "size", "text"],
  },
};
