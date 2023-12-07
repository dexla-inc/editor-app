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

const badgeColor = {
  Banned: "Danger.9",
  Pending: "Background.9",
  Active: "Success.9",
};

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;
  const data = props.data ?? [
    {
      name: "Angelique Morse",
      phoneNumber: "500-268-4826",
      company: "Wuckert Inc",
      status: "Banned",
    },
    {
      name: "Ariana Lang",
      phoneNumber: "408-439-8033",
      company: "Feest Group",
      status: "Pending",
    },
    {
      name: "Aspen Schmitt",
      phoneNumber: "531-492-6028",
      company: "Kinh, Marquardt and Crist",
      status: "Banned",
    },
    {
      name: "Brycen Jimenez",
      phoneNumber: "201-465-1954",
      company: "Rempel, Hand and Herzog",
      status: "Active",
    },
    {
      name: "Chase Day",
      phoneNumber: "285-840-9338",
      company: "Mraz, Donnelly and Collins",
      status: "Banned",
    },
  ];

  return {
    id: nanoid(),
    name: "Container",
    description: "Table Container",
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
        description: "Table",
        props: { ...defaultTableValues, ...(props.props || {}) },
        children: [
          {
            id: nanoid(),
            name: "TableHead",
            description: "Table Head",
            blockDroppingChildrenInside: true,
            props: { style: {} },
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
                    props: {
                      style: {},
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Checkbox",
                        description: "Checkbox",
                        props: {
                          style: {
                            marginLeft: "10px",
                            width: "auto",
                            height: "auto",
                          },
                          ...(props.props || {}),
                        },
                        blockDroppingChildrenInside: true,
                      },
                    ],
                  },
                  ...["Name", "Phone Number", "Company", "Status", ""].map(
                    (header) => ({
                      id: nanoid(),
                      key: nanoid(),
                      name: "TableCell",
                      description: "Table Cell",
                      props: { style: {} },
                      children: [
                        {
                          id: nanoid(),
                          name: "Text",
                          description: "Text",
                          props: { children: header },
                        },
                      ],
                    }),
                  ),
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "TableBody",
            description: "Table Body",
            blockDroppingChildrenInside: true,
            props: { style: {} },
            children: [
              ...data.map((row: any) => ({
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
                    props: { style: {} },
                    children: [
                      {
                        id: nanoid(),
                        name: "Checkbox",
                        description: "Checkbox",
                        props: {
                          style: {
                            marginLeft: "10px",
                            width: "auto",
                            height: "auto",
                          },
                          ...(props.props || {}),
                        },
                        blockDroppingChildrenInside: true,
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: { style: {} },
                    children: [
                      {
                        id: nanoid(),
                        name: "Container",
                        description: "Container",
                        props: {
                          style: {
                            alignItems: "center",
                            gap: "10px",
                          },
                        },
                        children: [
                          {
                            id: nanoid(),
                            name: "Avatar",
                            description: "Avatar",
                            blockDroppingChildrenInside: true,
                            props: {
                              style: {
                                borderRadius: "50px",
                              },
                              children: row.name
                                .split(" ")
                                .map((name: string) => name[0])
                                .join(""),
                            },
                          },
                          {
                            id: nanoid(),
                            name: "Text",
                            description: "Text",
                            blockDroppingChildrenInside: true,
                            props: {
                              style: {},
                              children: row.name,
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: {},
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        blockDroppingChildrenInside: true,
                        props: {
                          children: row.phoneNumber,
                        },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: {},
                    children: [
                      {
                        id: nanoid(),
                        name: "Text",
                        description: "Text",
                        blockDroppingChildrenInside: true,
                        props: {
                          children: row.company,
                        },
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: {},
                    children: [
                      {
                        id: nanoid(),
                        name: "Badge",
                        description: "Badge",
                        children: [],
                        props: {
                          children: row.status,
                          variant: "light",
                          radius: "xl",
                          size: "md",
                          color:
                            badgeColor[row.status as keyof typeof badgeColor],
                          ...(props.props || {}),
                        },
                        blockDroppingChildrenInside: true,
                      },
                    ],
                  },
                  {
                    id: nanoid(),
                    key: nanoid(),
                    name: "TableCell",
                    description: "Table Cell",
                    props: { style: {} },
                    children: [
                      {
                        id: nanoid(),
                        name: "Container",
                        description: "Container",
                        props: {
                          style: {
                            alignItems: "center",
                            gap: "10px",
                          },
                        },
                        children: [
                          {
                            id: nanoid(),
                            name: "ButtonIcon",
                            description: "ButtonIcon",
                            props: {
                              style: {
                                width: "auto",
                                height: "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              color: "Primary",
                            },
                            blockDroppingChildrenInside: true,
                            children: [
                              {
                                id: nanoid(),
                                name: "Icon",
                                description: "Icon",
                                props: {
                                  style: {
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50px",
                                  },
                                  name: "IconPencil",
                                },
                                children: [],
                                blockDroppingChildrenInside: true,
                              },
                            ],
                          },
                          {
                            id: nanoid(),
                            name: "ButtonIcon",
                            description: "ButtonIcon",
                            props: {
                              style: {
                                width: "auto",
                                height: "auto",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              },
                              color: "Primary",
                            },
                            blockDroppingChildrenInside: true,
                            children: [
                              {
                                id: nanoid(),
                                name: "Icon",
                                description: "Icon",
                                props: {
                                  style: {
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50px",
                                  },
                                  name: "IconDotsVertical",
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
                ],
              })),
            ],
          },
        ],
      },
    ],
  };
};
