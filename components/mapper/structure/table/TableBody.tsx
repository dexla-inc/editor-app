import { defaultTheme } from "@/components/IFrame";
import * as TableCheckbox from "@/components/mapper/structure/Checkbox";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const checkbox = TableCheckbox.jsonStructure(theme);
  const headers = ["Position", "Mass", "Symbol", "Name"];

  return {
    id: nanoid(),
    name: "TableBody",
    description: "Table Body",
    blockDroppingChildrenInside: true,
    props: { ...(props.props || {}) },
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
            props: {},
            children: [
              {
                id: nanoid(),
                name: "TableCell",
                description: "Table Cell",
                props: { type: "th" },
                children: [checkbox],
              },
              ...headers.map((header) => ({
                id: nanoid(),
                name: "TableCell",
                description: "Column Title",
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
        ],
      },
    ],
  };
};
