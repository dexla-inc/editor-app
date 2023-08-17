import { structureMapper } from "@/utils/componentMapper";
import { Component, traverseComponents } from "@/utils/editor";
import { nanoid } from "nanoid";

type ChartProps = { series: { name: string; data: number[] }[] };
type XAxisProps = { xaxis: { categories: string[] } };

type PieChart = {
  name: "PieChart";
  props: { series: number[]; options: { labels: string[] } };
};
type RadarChart = { name: "RadarChart"; props: ChartProps & XAxisProps };
type BarChart = { name: "BarChart"; props: ChartProps & XAxisProps };
type LineChart = { name: "LineChart"; props: ChartProps & XAxisProps };
type AreaChart = { name: "AreaChart"; props: ChartProps & XAxisProps };

type Table = { name: "Table"; props: { data: { [key: string]: string }[] } };

type Button = {
  name: "Button";
  props: { value: string; [key: string]: string };
};
type Checkbox = { name: "Checkbox"; props: { label: string } };
type Radio = { name: "Radio"; props: { label: string } };
type Select = {
  name: "Select";
  props: { label: string; placeholder: string };
};
type Input = {
  name: "Input";
  props: { label: string; placeholder: string };
};
type Textarea = {
  name: "Textarea";
  props: { label: string; placeholder: string };
};
type DateInput = {
  name: "DateInput";
  props: { label: string; placeholder: string };
};
type Form = {
  name: "Form";
  children: (
    | Input
    | DateInput
    | Button
    | Select
    | Checkbox
    | Radio
    | Textarea
  )[];
};

type Chart = PieChart | RadarChart | BarChart | LineChart | AreaChart;

type Card = {
  type: "Chart" | "Form" | "Table";
  title: string;
  component: Chart | Form | Table;
  isFullWidth?: boolean;
};

export type Data = {
  cards: Card[];
};

const getCard = (card: Card, cardContent: Component) => {
  return {
    id: nanoid(),
    name: "Container",
    description: "Container",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        rowGap: "20px",
        columnGap: "20px",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        position: "relative",
        borderTopStyle: "solid",
        borderRightStyle: "solid",
        borderBottomStyle: "solid",
        borderLeftStyle: "solid",
        borderTopWidth: "1px",
        borderRightWidth: "1px",
        borderBottomWidth: "1px",
        borderLeftWidth: "1px",
        borderTopColor: "#CCCCCC",
        borderRightColor: "#CCCCCC",
        borderBottomColor: "#CCCCCC",
        borderLeftColor: "#CCCCCC",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
        paddingTop: "40px",
        paddingBottom: "40px",
        paddingLeft: "40px",
        paddingRight: "40px",
        width: card.isFullWidth ? "100%" : "48%",
        height: "auto",
        minHeight: "10px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#CCCCCC",
        minWidth: "100%",
      },
      bg: "White.0",
    },
    children: [
      {
        id: nanoid(),
        name: "Title",
        description: "Title",
        children: [],
        props: {
          children: card.title,
          color: "Black.6",
          order: 4,
          style: {
            fontWeight: "bold",
            fontSize: "1.125rem",
            lineHeight: 1.45,
            width: "auto",
            height: "auto",
            marginBottom: "20px",
          },
        },
        blockDroppingChildrenInside: true,
      },
      cardContent,
    ],
  };
};

export const template = (data: Data, theme: any, pages: any) => {
  const cards = data.cards.map((card: Card) => {
    const children = (card.component as any).children ?? [];
    const childrenComponents = children
      ? traverseComponents(children, theme, pages)
      : undefined;

    const cardContent = structureMapper[card.component.name].structure({
      theme,
      props: { ...((card.component as any).props ?? {}) },
      children: childrenComponents,
    });

    return getCard(card, cardContent);
  });

  const navBar = structureMapper["Navbar"].structure({
    theme,
    pages,
  });

  return {
    root: {
      id: "root",
      name: "Container",
      description: "Root Container",
      props: { style: { width: "100%" } },
      children: [
        navBar,
        {
          id: "content-wrapper",
          name: "Container",
          description: "Root Container",
          props: {
            style: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              minHeight: "50px",
            },
          },
          children: [
            {
              id: nanoid(),
              name: "AppBar",
              description: "Page Heading",
              fixedPosition: { position: "top", target: "content-wrapper" },
              props: {
                style: {
                  borderTopStyle: "none",
                  borderRightStyle: "none",
                  borderBottomStyle: "solid",
                  borderLeftStyle: "none",
                  borderTopWidth: "0px",
                  borderRightWidth: "0px",
                  borderBottomWidth: "1px",
                  borderLeftWidth: "1px",
                  borderTopColor: "Border.6",
                  borderRightColor: "Border.6",
                  borderBottomColor: "#CCCCCC",
                  borderLeftColor: "#CCCCCC",
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                  height: "auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "1rem",
                },
                bg: "White.0",
              },
              children: [
                {
                  id: nanoid(),
                  name: "ButtonIcon",
                  description: "Notifications button",
                  props: {
                    variant: "outline",
                    color: "Primary",
                    size: "lg",
                    radius: "xl",
                    style: { backgroundColor: "white" },
                  },
                  blockDroppingChildrenInside: true,
                  children: [
                    {
                      id: nanoid(),
                      name: "Icon",
                      description: "Icon",
                      props: { name: "IconBell" },
                      children: [],
                      blockDroppingChildrenInside: true,
                    },
                  ],
                },
                {
                  id: nanoid(),
                  name: "ButtonIcon",
                  description: "Settings button",
                  props: {
                    variant: "outline",
                    color: "Primary",
                    size: "lg",
                    radius: "xl",
                    style: { backgroundColor: "white" },
                  },
                  blockDroppingChildrenInside: true,
                  children: [
                    {
                      id: nanoid(),
                      name: "Icon",
                      description: "Icon",
                      props: {
                        name: "IconSettings",
                        style: { color: "Primary.6" },
                      },
                      children: [],
                      blockDroppingChildrenInside: true,
                    },
                  ],
                },
                {
                  id: nanoid(),
                  name: "ButtonIcon",
                  description: "Profile button",
                  props: {
                    variant: "outline",
                    color: "Primary",
                    size: "lg",
                    radius: "xl",
                    style: { backgroundColor: "white" },
                  },
                  blockDroppingChildrenInside: true,
                  children: [
                    {
                      id: nanoid(),
                      name: "Icon",
                      description: "Icon",
                      props: { name: "IconUserCircle" },
                      children: [],
                      blockDroppingChildrenInside: true,
                    },
                  ],
                },
              ],
            },
            {
              id: nanoid(),
              name: "Container",
              description: "Container",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "row",
                  rowGap: "40px",
                  columnGap: "4%",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  position: "relative",
                  borderTopStyle: "none",
                  borderRightStyle: "none",
                  borderBottomStyle: "none",
                  borderLeftStyle: "none",
                  borderTopWidth: "0px",
                  borderRightWidth: "0px",
                  borderBottomWidth: "0px",
                  borderLeftWidth: "0px",
                  borderTopColor: "Border.6",
                  borderRightColor: "Border.6",
                  borderBottomColor: "Border.6",
                  borderLeftColor: "Border.6",
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  paddingTop: "40px",
                  paddingBottom: "40px",
                  paddingLeft: "40px",
                  paddingRight: "40px",
                  width: "100%",
                  height: "auto",
                  minHeight: "10px",
                  flexWrap: "wrap",
                },
              },
              children: cards,
            },
          ],
        },
      ],
    },
  };
};
