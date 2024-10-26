import { ComponentStructure } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultTheme } from "@/utils/branding";
import { requiredModifiers } from "@/utils/modifiers";
import merge from "lodash.merge";

export const jsonStructure = (props?: any): ComponentStructure => {
  const theme = props?.theme ?? defaultTheme;
  const defaultValues = requiredModifiers.text;
  const content =
    props?.props?.children ??
    props?.props?.content ??
    props?.props?.text ??
    props?.props?.value ??
    "New text";

  return {
    id: nanoid(),
    name: "Text",
    description: "Text",
    props: merge({}, defaultValues, {
      children: content,
      color: `${theme.colors.Black ? "Black.6" : "dark"}`,
      style: {
        lineHeight: "110%",
        letterSpacing: "0px",
        fontWeight: "normal",
        gridColumn: "1/6",
        gridRow: "1/3",
      },
      ...(props?.props ?? {}),
    }),
    blockDroppingChildrenInside: true,
  };
};
