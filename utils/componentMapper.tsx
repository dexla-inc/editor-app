import { AppBar } from "@/components/mapper/AppBar";
import { BarChart } from "@/components/mapper/BarChart";
import { Breadcrumb } from "@/components/mapper/Breadcrumb";
import { LineChart } from "@/components/mapper/LineChart";
import { NotImplement } from "@/components/mapper/NotImplemented";
import { PieChart } from "@/components/mapper/PieChart";
import { ProgressCard } from "@/components/mapper/ProgressCard";
import { TaskList } from "@/components/mapper/TaskList";
import { Box } from "@mantine/core";

export type ComponentDefinition = {
  Component: any;
};

export type ComponentMapper = {
  [key: string]: ComponentDefinition;
};

export const componentMapper: ComponentMapper = {
  Breadcrumb: {
    Component: (props: any) => <Breadcrumb {...props} />,
  },
  AppBar: { Component: (props: any) => <AppBar {...props} /> },
  Accordion: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  Carousel: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  Form: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  Table: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  StepperForm: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  CodeSnippet: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  ProgressCard: {
    Component: (props: any) => <ProgressCard {...props} />,
  },
  ImageCard: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  ProfileCard: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  BarChart: {
    Component: (props: any) => <BarChart {...props} />,
  },
  StackedBarChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  RadialBarChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  MixBarChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  ScatterChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  LineChart: {
    Component: (props: any) => <LineChart {...props} />,
  },
  PieChart: {
    Component: (props: any) => <PieChart {...props} />,
  },
  AreaChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  ComposedChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  StackedAreaChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  PercentAreaChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  RadarChart: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  Newsfeed: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  FilePond: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  CardList: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  TaskList: {
    Component: (props: any) => <TaskList {...props} />,
  },
  ProfileList: {
    Component: (props: any) => <NotImplement {...props} />,
  },
  ImageCardList: {
    Component: (props: any) => <NotImplement {...props} />,
  },
};
