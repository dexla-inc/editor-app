import { jsonStructure as headerStructure } from "@/libs/dnd-flex/components/mapper/structure/table/TableActionsRow";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { table: defaultTableValues, button, input } = requiredModifiers;
  const tableHeader = headerStructure({ button, input });

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
        padding: "20px",
      },
      bg: "White.6",
    },
    blockDroppingChildrenInside: true,
    children: [
      tableHeader,
      {
        id: nanoid(),
        name: "Table",
        description: "Table",
        onLoad: {
          columns: ["Name", "Phone Number", "Company", "Status", ""],
        },
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
                props: {
                  style: {
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    backgroundColor: "Neutral.6",
                    width: "100%",
                  },
                },
                children: [
                  {
                    id: nanoid(),
                    name: "TableHeaderCell",
                    description: "Table Header Cell",
                    props: {
                      style: {
                        paddingLeft: "0px",
                        paddingRight: "0px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      },
                    },
                    children: [
                      {
                        id: nanoid(),
                        name: "Checkbox",
                        description: "Checkbox",
                        props: {
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
                      name: "TableHeaderCell",
                      description: "Table Header Cell",
                      props: {
                        style: {
                          paddingLeft: "0px",
                          paddingRight: "0px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                        },
                      },
                      children: [
                        {
                          id: nanoid(),
                          name: "Text",
                          description: "Text",
                          props: {
                            weight: "bold",
                            size: "sm",
                            children: header,
                          },
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
            children: [],
            // children: [
            //   ...data.map((row: any) => ({
            //     id: nanoid(),
            //     name: "TableRow",
            //     description: "Table Row",
            //     blockDroppingChildrenInside: true,
            //     props: { style: { width: "100%" } },
            //     children: [
            //       {
            //         id: nanoid(),
            //         name: "TableCell",
            //         description: "Table Cell",
            //         props: { style: {} },
            //         children: [
            //           {
            //             id: nanoid(),
            //             name: "Checkbox",
            //             description: "Checkbox",
            //             props: {
            //               ...(props.props || {}),
            //             },
            //             blockDroppingChildrenInside: true,
            //           },
            //         ],
            //       },
            //       {
            //         id: nanoid(),
            //         key: nanoid(),
            //         name: "TableCell",
            //         description: "Table Cell",
            //         props: { style: {} },
            //         children: [
            //           {
            //             id: nanoid(),
            //             name: "Container",
            //             description: "Container",
            //             props: {
            //               style: {
            //                 alignItems: "center",
            //                 gap: "10px",
            //               },
            //             },
            //             children: [
            //               {
            //                 id: nanoid(),
            //                 name: "Avatar",
            //                 description: "Avatar",
            //                 blockDroppingChildrenInside: true,
            //                 props: {
            //                   color: "Primary.6",
            //                   style: {
            //                     borderRadius: "50px",
            //                   },
            //                   children: row.name
            //                     .split(" ")
            //                     .map((name: string) => name[0])
            //                     .join(""),
            //                 },
            //               },
            //               {
            //                 id: nanoid(),
            //                 name: "Text",
            //                 description: "Text",
            //                 blockDroppingChildrenInside: true,
            //                 props: {
            //                   style: {},
            //                   children: row.name,
            //                 },
            //               },
            //             ],
            //           },
            //         ],
            //       },
            //       {
            //         id: nanoid(),
            //         key: nanoid(),
            //         name: "TableCell",
            //         description: "Table Cell",
            //         props: {},
            //         children: [
            //           {
            //             id: nanoid(),
            //             name: "Text",
            //             description: "Text",
            //             blockDroppingChildrenInside: true,
            //             props: {
            //               children: row.phoneNumber,
            //             },
            //           },
            //         ],
            //       },
            //       {
            //         id: nanoid(),
            //         key: nanoid(),
            //         name: "TableCell",
            //         description: "Table Cell",
            //         props: {},
            //         children: [
            //           {
            //             id: nanoid(),
            //             name: "Text",
            //             description: "Text",
            //             blockDroppingChildrenInside: true,
            //             props: {
            //               children: row.company,
            //             },
            //           },
            //         ],
            //       },
            //       {
            //         id: nanoid(),
            //         key: nanoid(),
            //         name: "TableCell",
            //         description: "Table Cell",
            //         props: {},
            //         children: [
            //           {
            //             id: nanoid(),
            //             name: "Badge",
            //             description: "Badge",
            //             children: [],
            //             props: {
            //               children: row.status,
            //               variant: "light",
            //               radius: "xl",
            //               size: "sm",
            //               color:
            //                 badgeColor[row.status as keyof typeof badgeColor],
            //               ...(props.props || {}),
            //             },
            //             blockDroppingChildrenInside: true,
            //           },
            //         ],
            //       },
            //       {
            //         id: nanoid(),
            //         key: nanoid(),
            //         name: "TableCell",
            //         description: "Table Cell",
            //         props: { style: {} },
            //         children: [
            //           {
            //             id: nanoid(),
            //             name: "Container",
            //             description: "Container",
            //             props: {
            //               style: {
            //                 alignItems: "center",
            //                 gap: "10px",
            //               },
            //             },
            //             children: [
            //               {
            //                 id: nanoid(),
            //                 name: "ButtonIcon",
            //                 description: "ButtonIcon",
            //                 props: {
            //                   style: {
            //                     width: "auto",
            //                     height: "auto",
            //                     display: "flex",
            //                     alignItems: "center",
            //                     justifyContent: "center",
            //                   },
            //                   color: "Primary",
            //                 },
            //                 blockDroppingChildrenInside: true,
            //                 children: [
            //                   {
            //                     id: nanoid(),
            //                     name: "Icon",
            //                     description: "Icon",
            //                     props: {
            //                       size: "sm",
            //                       style: {
            //                         borderRadius: "50px",
            //                       },
            //                       name: "IconPencil",
            //                     },
            //                     children: [],
            //                     blockDroppingChildrenInside: true,
            //                   },
            //                 ],
            //               },
            //               {
            //                 id: nanoid(),
            //                 name: "ButtonIcon",
            //                 description: "ButtonIcon",
            //                 props: {
            //                   style: {
            //                     width: "auto",
            //                     height: "auto",
            //                     display: "flex",
            //                     alignItems: "center",
            //                     justifyContent: "center",
            //                   },
            //                   color: "Primary",
            //                 },
            //                 blockDroppingChildrenInside: true,
            //                 children: [
            //                   {
            //                     id: nanoid(),
            //                     name: "Icon",
            //                     description: "Icon",
            //                     props: {
            //                       style: {
            //                         borderRadius: "50px",
            //                       },
            //                       name: "IconDotsVertical",
            //                     },
            //                     children: [],
            //                     blockDroppingChildrenInside: true,
            //                   },
            //                 ],
            //               },
            //             ],
            //           },
            //         ],
            //       },
            //     ],
            //   })),
            // ],
          },
        ],
      },
    ],
  };
};
