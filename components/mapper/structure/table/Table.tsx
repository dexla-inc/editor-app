import { tableHeader } from "@/components/mapper/structure/table/TableHeader";
import { defaultTheme } from "@/utils/branding";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

const defaultTableValues = {
  highlightOnHover: true,
  horizontalCellSpacing: "sm",
  verticalCellSpacing: "sm",
  striped: false,
  withBorder: false,
  withColumnBorder: false,
  style: { width: "100%" },
};

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const data = props.data ?? [
    { position: 6, mass: 12.011, symbol: "C", name: "Carbon" },
    { position: 7, mass: 14.007, symbol: "N", name: "Nitrogen" },
    { position: 39, mass: 88.906, symbol: "Y", name: "Yttrium" },
    { position: 56, mass: 137.33, symbol: "Ba", name: "Barium" },
    { position: 58, mass: 140.12, symbol: "Ce", name: "Cerium" },
    { position: 1, mass: 1.008, symbol: "H", name: "Hydrogen" },
    { position: 8, mass: 15.999, symbol: "O", name: "Oxygen" },
    { position: 20, mass: 40.08, symbol: "Ca", name: "Calcium" },
    { position: 47, mass: 107.87, symbol: "Ag", name: "Silver" },
    { position: 63, mass: 151.96, symbol: "Eu", name: "Europium" },
  ];

  return {
    id: nanoid(),
    name: "Container",
    description: "Table",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
      },
    },
    blockDroppingChildrenInside: true,
    children: [
      tableHeader,
      {
        id: nanoid(),
        name: "Table",
        description: "Table Body",
        props: { ...defaultTableValues, ...(props.props || {}) },
        children: [
          {
            id: nanoid(),
            name: "TableContent",
            description: "Table Head",
            blockDroppingChildrenInside: true,
            props: { type: "thead" },
            children: [
              {
                id: nanoid(),
                name: "TableRow",
                description: "Table Row",
                blockDroppingChildrenInside: true,
                props: { style: { width: "100%" } },
                children: [
                  {
                    id: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: { type: "th" },
                    children: [
                      {
                        id: nanoid(),
                        name: "Checkbox",
                        description: "Checkbox",
                        props: {
                          style: {
                            width: "auto",
                            height: "auto",
                          },
                          ...(props.props || {}),
                        },
                        blockDroppingChildrenInside: true,
                      },
                    ],
                  },
                  ...Object.keys(data[0]).map((header) => ({
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: { type: "th" },
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        props: { children: header },
                      },
                    ],
                  })),
                ],
              },
              ...data.map((item: any) => ({
                id: nanoid(),
                key: nanoid(),
                name: "TableRow",
                description: "Table Row",
                blockDroppingChildrenInside: true,
                props: { style: { width: "100%" } },
                children: [
                  {
                    id: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: { type: "td" },
                    children: [
                      {
                        id: nanoid(),
                        name: "Checkbox",
                        description: "Checkbox",
                        props: {
                          style: {
                            width: "auto",
                            height: "auto",
                          },
                          ...(props.props || {}),
                        },
                        blockDroppingChildrenInside: true,
                      },
                    ],
                  },
                  ...Object.keys(item).map((data) => ({
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: { type: "th" },
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        props: {
                          children: (item as Record<string, any>)[data],
                        },
                      },
                    ],
                  })),
                ],
              })),
            ],
          },
        ],
      },
    ],
  };
};
