import { defaultTheme, getColorValue } from "@/utils/branding";
import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";

// Incomplete
export const jsonStructure = (props?: any): ComponentStructure => {
  const {
    theme = defaultTheme,
    children = "New Option",
    optionValue = { static: "new-option" },
    ...restProps
  } = props ?? {};
  const textStructure = structureMapper["Text"].structure;
  const containerStructure = structureMapper["Container"].structure;

  const defaultBorderColor = getColorValue(theme, "Border.6");
  const selectedBackgroundColor = getColorValue(theme, "Primary.6");
  const textCheckboxItem = textStructure({
    props: { children },
  });
  const containerCheckbox = containerStructure({
    props: {
      style: {
        borderWidth: "1px",
        borderRadius: "8px",
        borderStyle: "solid",
        borderColor: defaultBorderColor,
        backgroundColor: "transparent",
        gridColumn: "1/30",
        gridRow: "1/10",
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
          color: "transparent",
          style: {
            gridColumn: "1/3",
            gridRow: "1/3",
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
      style: {
        gridColumn: "4/12",
        gridRow: "1/3",
      },
    },
  });

  return {
    id: nanoid(),
    name: "Checkbox",
    description: "Checkbox",
    props: {
      style: {
        gridColumn: "1/3",
        gridRow: "1/3",
        cursor: "default",
        borderRadius: "2px",
      },
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
