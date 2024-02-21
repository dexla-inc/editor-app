import { defaultBorderValues } from "@/components/modifiers/Border";
import { structureMapper } from "@/utils/componentMapper";
import { Component, traverseComponents } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

type ChartProps = { series: { name: string; data: number[] }[] };
type XAxisProps = { xaxis: { categories: string[] } };

type PieChart = {
  name: "PieChart";
  props: { series: number[]; options: { labels: string[] } };
};
type RadialChart = { name: "RadialChart" } & Omit<PieChart, "name">;
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

type Chart =
  | PieChart
  | RadarChart
  | BarChart
  | LineChart
  | AreaChart
  | RadialChart;

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
        padding: "20px",
        width: card.isFullWidth ? "100%" : "48%",
        height: "auto",
        minHeight: "10px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "#CCCCCC",
        minWidth: "100%",
      },
      bg: "White.6",
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
      ? traverseComponents(children, theme)
      : undefined;

    const isTable = card.component.name === "Table";

    let tableData = {};
    if (isTable && (card.component as any)?.props?.data?.length > 0) {
      const headers = Object.keys(
        (card.component as any)?.props?.data[0],
      ).reduce((acc, key) => {
        return {
          ...acc,
          [key]: true,
        };
      }, {});

      tableData = {
        headers,
        config: { filter: false, sorting: false, pagination: false },
      };
    }

    const cardContent = structureMapper[card.component.name].structure({
      theme,
      props: {
        ...((card.component as any).props ?? {}),
        ...(isTable
          ? {
              exampleData: {
                value: (card.component as any)?.props?.data ?? {},
              },
              ...tableData,
            }
          : {}),
      },
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
      props: { style: { width: "100%", position: "relative" } },
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
              minHeight: "20px",
            },
          },
          children: [
            {
              id: nanoid(),
              name: "AppBar",
              description: "AppBar",
              fixedPosition: { position: "top", target: "content-wrapper" },
              props: {
                style: {
                  ...defaultBorderValues,
                  borderBottomWidth: `1px`,
                  borderBottomStyle: `solid`,
                  borderBottomColor: theme.colors.Border
                    ? "Border.6"
                    : "gray.3",
                  padding: px(theme.spacing.lg),
                  height: "auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: theme.spacing.md,
                },
              },
              children: [
                {
                  id: nanoid(),
                  name: "Container",
                  description: "Search box",
                  props: {
                    style: { display: "flex", alignItems: "center" },
                  },
                  blockDroppingChildrenInside: true,
                  children: [
                    {
                      id: nanoid(),
                      name: "Input",
                      description: "Search",
                      props: {
                        variant: "default",
                        radius: "md",
                        type: "search",
                        size: "sm",
                        icon: {
                          props: { name: "IconSearch" },
                        },
                        placeholder: "Search anything...",
                      },
                      blockDroppingChildrenInside: true,
                    },
                  ],
                },
                {
                  id: nanoid(),
                  name: "Container",
                  description: "Buttons container",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    },
                  },
                  blockDroppingChildrenInside: true,
                  children: [
                    {
                      id: nanoid(),
                      name: "Container",
                      description: "Notifications Container",
                      props: {
                        style: {
                          width: "35px",
                          height: "35px",
                          overflow: "hidden",
                          borderRadius: "50%",
                          padding: "0px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          type: "button",
                        },
                      },
                      blockDroppingChildrenInside: true,
                      children: [
                        {
                          id: nanoid(),
                          name: "Container",
                          description: "Notifications Container",
                          props: {
                            style: {
                              width: "25px",
                              height: "25px",
                              overflow: "hidden",
                              borderRadius: "50%",
                            },
                          },
                          blockDroppingChildrenInside: true,
                          children: [
                            {
                              id: nanoid(),
                              name: "Image",
                              description: "Notifications button",
                              props: {
                                fit: "cover",
                                alt: "Notification",
                                src: "https://dexlastatesdev.blob.core.windows.net/temp/notifications.svg",
                                style: {
                                  width: "25px",
                                  height: "25px",
                                  filter: "contrast(40%)",
                                },
                              },
                              blockDroppingChildrenInside: true,
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: nanoid(),
                      name: "Container",
                      description: "Settings Container",
                      props: {
                        style: {
                          width: "35px",
                          height: "35px",
                          overflow: "hidden",
                          borderRadius: "50%",
                          padding: "0px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          type: "button",
                        },
                      },
                      blockDroppingChildrenInside: true,
                      children: [
                        {
                          id: nanoid(),
                          name: "Container",
                          description: "Settings Container",
                          props: {
                            style: {
                              width: "25px",
                              height: "25px",
                              overflow: "hidden",
                              borderRadius: "50%",
                            },
                          },
                          blockDroppingChildrenInside: true,
                          children: [
                            {
                              id: nanoid(),
                              name: "Image",
                              description: "Settings button",
                              props: {
                                fit: "cover",
                                alt: "Settings",
                                src: "https://dexlastatesdev.blob.core.windows.net/temp/settings.svg",
                                style: {
                                  width: "25px",
                                  height: "25px",
                                  filter: "contrast(40%)",
                                },
                              },
                              blockDroppingChildrenInside: true,
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: nanoid(),
                      name: "Container",
                      description: "Profile Container",
                      props: {
                        style: {
                          width: "auto",
                          height: "35px",
                          overflow: "hidden",
                          borderRadius: "50%",
                          padding: "0px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: theme.spacing.xs,
                          cursor: "pointer",
                          type: "button",
                        },
                      },
                      blockDroppingChildrenInside: true,
                      children: [
                        {
                          id: nanoid(),
                          name: "Container",
                          description: "Profile Container",
                          props: {
                            style: {
                              width: "25px",
                              height: "25px",
                              overflow: "hidden",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                          },
                          blockDroppingChildrenInside: true,
                          children: [
                            {
                              id: nanoid(),
                              name: "Image",
                              description: "Profile Image",
                              props: {
                                fit: "contain",
                                radius: "md",
                                alt: "Profile Image",
                                src: "https://dexlastatesdev.blob.core.windows.net/temp/avatar_25.jpg",
                                style: {
                                  width: "100%",
                                  height: "100%",
                                },
                              },
                              blockDroppingChildrenInside: true,
                              children: [],
                            },
                          ],
                        },
                        {
                          id: nanoid(),
                          name: "Title",
                          description: "Title",
                          props: {
                            children: "John Doe",
                            color: theme.colors.dark[7],
                            order: 5,
                            style: { fontWeight: "semibold" },
                          },
                          children: [],
                          blockDroppingChildrenInside: true,
                        },
                      ],
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
                  padding: "20px",
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
