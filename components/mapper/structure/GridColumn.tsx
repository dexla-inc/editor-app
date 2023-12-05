import { initialValues } from "@/components/modifiers/GridColumn";
import { GRAY_OUTLINE } from "@/utils/branding";
import { GRID_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  return {
    id: nanoid(),
    name: "GridColumn",
    description: "GridColumn",
    props: {
      span: GRID_SIZE / 2,
      style: {
        ...initialValues,
        height: "auto",
        outline: GRAY_OUTLINE,
        outlineOffset: "-2px",
      },
    },
  };
};
