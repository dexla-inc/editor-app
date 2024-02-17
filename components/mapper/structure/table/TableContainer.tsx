import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";

const badgeColor = {
  Banned: "Danger.9",
  Pending: "Background.9",
  Active: "Success.9",
};

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme;

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
      bg: theme.theme === "DARK" ? "Black.6" : "White.6",
    },
    blockDroppingChildrenInside: true,
    children: [],
  };
};
