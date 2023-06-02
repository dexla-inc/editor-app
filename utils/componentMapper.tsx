import { Component } from "@/utils/editor";
import * as AppBar from "@/components/mapper/structure/AppBar";
import * as NotImplemented from "@/components/mapper/structure/NotImplemented";
import { Box } from "@/components/mapper/Box";
import { Avatar } from "@/components/mapper/Avatar";
import { Text } from "@/components/mapper/Text";
import { Group } from "@/components/mapper/Group";
import { Flex } from "@/components/mapper/Flex";
import { Stack } from "@/components/mapper/Stack";

export type StructureDefinition = {
  structure: (props: any) => Component;
};

export type StructureMapper = {
  [key: string]: StructureDefinition;
};

export const structureMapper: StructureMapper = {
  Breadcrumb: {
    structure: (props: any) => NotImplemented.jsonStructure(props),
  },
  AppBar: { structure: (props: any) => AppBar.jsonStructure(props) },
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
};

export type ComponentDefinition = {
  Component: any;
};

export type ComponentMapper = {
  [key: string]: ComponentDefinition;
};

export const componentMapper: ComponentMapper = {
  Avatar: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Avatar component={props.component} renderTree={props.renderTree} />
    ),
  },
  Box: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Box component={props.component} renderTree={props.renderTree} />
    ),
  },
  Flex: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Flex component={props.component} renderTree={props.renderTree} />
    ),
  },
  Group: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Group component={props.component} renderTree={props.renderTree} />
    ),
  },
  Stack: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Stack component={props.component} renderTree={props.renderTree} />
    ),
  },
  Text: {
    Component: (props: { component: Component; renderTree: any }) => (
      <Text component={props.component} renderTree={props.renderTree} />
    ),
  },
};
