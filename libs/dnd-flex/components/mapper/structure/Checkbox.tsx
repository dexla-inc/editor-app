import { defaultTheme, getColorValue } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const {
    theme = defaultTheme,
    children = "New Option",
    optionValue = { static: "new-option" },
    ...restProps
  } = props ?? {};
  const textStructure = structureMapper()["Text"].structure;
  const containerStructure = structureMapper()["Container"].structure;

  const defaultBorderColor = getColorValue(theme, "Border.6");
  const selectedBackgroundColor = getColorValue(theme, "Primary.6");
  const textCheckboxItem = textStructure({
    props: { children },
  });
  const containerCheckbox = containerStructure({
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "4px",
        width: "auto",
        height: "auto",
        borderWidth: "1px",
        borderRadius: "8px",
        borderStyle: "solid",
        borderColor: defaultBorderColor,
        backgroundColor: "transparent",
      },
    },
    states: {
      checked: {
        style: {
          borderStyle: "none",
          backgroundColor: selectedBackgroundColor,
        },
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Icon",
        description: "Icon",
        props: {
          name: "IconCheck",
          width: "12px",
          color: "transparent",
          style: {
            position: "relative",
            width: "12px",
            height: "12px",
          },
        },
        blockDroppingChildrenInside: true,
        states: {
          checked: {
            name: "IconCheck",
            color: "White.6",
          },
        },
      },
    ],
  });

  const containerCheckboxItem = containerStructure({
    children: [containerCheckbox, textCheckboxItem],
    props: {
      style: { display: "flex", alignItems: "center", width: "100%" },
    },
  });

  return {
    id: nanoid(),
    name: "Checkbox",
    description: "Checkbox",
    props: {
      style: {
        width: "auto",
        height: "auto",
        cursor: "default",
        borderRadius: "2px",
      },
      // TODO: Get size from branding
      size: "sm",
      ...(restProps ?? {}),
    },
    onLoad: {
      value: {
        static: false,
        dataType: "static",
      },
      optionValue,
    },
    children: [containerCheckboxItem],
    states: { disabled: { bg: "Neutral.6", textColor: "Neutral.9" } },
    blockDroppingChildrenInside: false,
  };
};
