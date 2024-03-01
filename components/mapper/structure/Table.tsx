import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const select = structureMapper["Select"].structure({});
  const defaultButton = structureMapper["Button"].structure({});

  const { input: defaultInputValues, text: defaultTextValues } =
    requiredModifiers;
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
        paddingRight: "20px",
        padding: "20px",
        paddingTop: "20px",
        paddingBottom: "20px",
        paddingLeft: "20px",
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Table Header",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "20px",
            width: "100%",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Input",
            description: "Input",
            props: {
              style: {
                width: "300px",
                height: "auto",
                flexDirection: "column",
              },
              ...defaultInputValues,
              placeholder: "Search",
              icon: {
                props: { name: "IconSearch" },
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Container",
            description: "Table Actions Container",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                width: "auto",
              },
            },
            children: [
              {
                id: nanoid(),
                ...select,
                props: {
                  style: {
                    width: "150px",
                  },
                  data: [
                    { label: "Action 1", value: "Action 1" },
                    { label: "Action 2", value: "Action 2" },
                    { label: "Action 3", value: "Action 3" },
                  ],
                  placeholder: "Actions",
                },
              },
              {
                id: nanoid(),
                ...defaultButton,
                props: {
                  children: "Export CSV",
                  color: "Primary.6",
                  textColor: "PrimaryText.6",
                  leftIcon: "IconDownload",
                },
                blockDroppingChildrenInside: true,
              },
            ],
          },
        ],
      },
      {
        id: nanoid(),
        name: "Table",
        description: "Table Body",
        props: {
          exampleData: {
            value: [
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
            ],
          },
          headers: { position: true, mass: true, symbol: true, name: true },
          config: {
            select: false,
            sorting: false,
          },
          style: {
            width: "100%",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          },
          ...(props.props || {}),
        },
        onLoad: {},
        children: [],
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Container",
        description: "Table Footer",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
            width: "100%",
          },
        },
        children: [
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            props: {
              children: "Showing 5 results of 10",
              ...defaultTextValues,
            },
          },
          {
            id: nanoid(),
            ...select,
            props: {
              style: {
                width: "70px",
              },
              defaultValue: 5,
              data: [
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 15, value: 15 },
              ],
            },
          },
          {
            id: nanoid(),
            name: "Pagination",
            description: "Pagination",
            props: { value: 1, total: 2, style: {} },
            children: [],
          },
        ],
      },
    ],
  };
};
