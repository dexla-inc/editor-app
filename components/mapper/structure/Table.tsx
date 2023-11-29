import { defaultButtonValues } from "@/components/modifiers/Button";
import { defaultInputValues } from "@/components/modifiers/Input";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
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
        description: "Table Actions Header",
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
                name: "Select",
                description: "Select",
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
                name: "Button",
                description: "Button",
                props: {
                  style: {
                    ...defaultButtonValues,
                    width: "auto",
                    height: "auto",
                    padding: "9px",
                    borderRadius: 8,
                    borderColor: "rgba(179, 179, 179, 1)",
                    borderStyle: "solid",
                    borderWidth: "1px",
                  },
                  color: "transparent",
                  textColor: "Black.7",
                  children: "Export CSV",
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
        description: "Table",
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
        children: [
          {
            id: nanoid(),
            name: "Container",
            description: "Table Actions Footer",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "20px",
                width: "100%",
                paddingTop: "20px",
                paddingBottom: "20px",
              },
            },
            children: [
              {
                id: nanoid(),
                name: "Select",
                description: "Select",
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
                props: {
                  style: {},
                },
                children: [],
              },
            ],
          },
        ],
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
