import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => ({
  id: nanoid(),
  name: "Breadcrumb",
  description: "Breadcrumb",
  columns: props.comluns || 12,
  props: {
    w: "100%",
    py: "xl",
    px: "md",
  },
  children: [
    {
      id: nanoid(),
      name: "Text",
      columns: 0,
      description: "Breadcrumb Item",
      children: [],
      props: {
        children: "Home",
        size: "sm",
      },
    },
    {
      id: nanoid(),
      name: "Text",
      columns: 0,
      description: "Breadcrumb Item",
      children: [],
      props: {
        children: "Settings",
        size: "xs",
      },
    },
    {
      id: nanoid(),
      name: "Text",
      columns: 0,
      description: "Breadcrumb Item",
      children: [],
      props: {
        children: "About",
        size: "xs",
      },
    },
  ],
});
