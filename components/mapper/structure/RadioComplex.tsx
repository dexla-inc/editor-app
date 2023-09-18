import { Component } from "@/utils/editor";
import { nanoid } from "nanoid";
import { defaultTheme } from "@/components/IFrame";
import { px } from "@mantine/core";

export const jsonStructure = (props?: any): Component => {
  const radioGroupId = nanoid();
  const theme = props.theme ?? defaultTheme;

  return {
    id: radioGroupId,
    name: "Radio",
    description: "Radio Complex Group",
    props: {
      name: radioGroupId,
      label: "Select a radio",
      style: {
        width: "auto",
        height: "auto",
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "RadioItemComplex",
        description: "Radio Item",
        props: {
          value: "radio1",
          style: {
            borderRadius: 8,
            borderColor: "rgba(179, 179, 179, 1)",
            borderStyle: "solid",
            borderTopStyle: "solid",
            borderRightStyle: "solid",
            borderBottomStyle: "solid",
            borderLeftStyle: "solid",
            borderWidth: "1px",
            borderTopWidth: "1px",
            borderRightWidth: "1px",
            borderBottomWidth: "1px",
            borderLeftWidth: "1px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            display: "flex",
          },
          bg: "White.6",
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            children: [],
            props: {
              name: "IconBox",
              width: "24px",
              style: {
                width: "30px",
                height: "30px",
                marginRight: "0px",
                marginBottom: "10px",
                color: "rgba(28, 126, 214, 1)",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
              },
              bg: "Border.0",
            },
            blockDroppingChildrenInside: true,
            states: {
              hover: {
                bg: "Border.0",
              },
            },
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "Expert Appraisal",
              color: "Black.6",
              size: "sm",
              weight: "bold",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                marginRight: "0px",
                marginBottom: "10px",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children:
                "Request an appraisal conducted by a qualified valuer using our technology and productivity tools",
              color: "Black.4",
              size: "sm",
              weight: "normal",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "205px",
                height: "auto",
                marginRight: "0px",
                marginBottom: "10px",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "50 credits per appraisal",
              color: "Black.6",
              size: "sm",
              weight: "bold",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
        states: {
          hover: {
            bg: "Neutral.6",
          },
          checked: {
            bg: "Success.3",
          },
        },
      },
      {
        id: nanoid(),
        name: "Text",
        description: "Text",
        children: [],
        props: {
          children: "or",
          color: "Black.6",
          size: "xs",
          weight: "normal",
          style: {
            lineHeight: "110%",
            letterSpacing: "0px",
            width: "auto",
            height: "auto",
          },
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "RadioItemComplex",
        description: "Radio Item",
        props: {
          value: "radio2",
          style: {
            borderRadius: 8,
            borderColor: "rgba(179, 179, 179, 1)",
            borderStyle: "solid",
            borderTopStyle: "solid",
            borderRightStyle: "solid",
            borderBottomStyle: "solid",
            borderLeftStyle: "solid",
            borderWidth: "1px",
            borderTopWidth: "1px",
            borderRightWidth: "1px",
            borderBottomWidth: "1px",
            borderLeftWidth: "1px",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            display: "flex",
          },
          bg: "White.6",
        },
        children: [
          {
            id: nanoid(),
            name: "Icon",
            description: "Icon",
            children: [],
            props: {
              name: "IconCar",
              width: "24px",
              style: {
                width: "30px",
                height: "30px",
                marginRight: "0px",
                marginBottom: "10px",
                color: "rgba(28, 126, 214, 1)",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
              },
              bg: "Border.0",
            },
            blockDroppingChildrenInside: true,
            states: {
              hover: {
                bg: "Border.0",
              },
            },
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "Expert Drive-by Appraisal",
              color: "Black.6",
              size: "sm",
              weight: "bold",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
                marginRight: "0px",
                marginBottom: "10px",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children:
                "Request an appraisal conducted by a qualified valuer with an external visit from one of our partners",
              color: "Black.4",
              size: "sm",
              weight: "normal",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "240px",
                height: "auto",
                marginRight: "0px",
                marginBottom: "10px",
              },
            },
            blockDroppingChildrenInside: true,
          },
          {
            id: nanoid(),
            name: "Text",
            description: "Text",
            children: [],
            props: {
              children: "200 credits per appraisal",
              color: "Black.6",
              size: "sm",
              weight: "bold",
              style: {
                lineHeight: "110%",
                letterSpacing: "0px",
                width: "auto",
                height: "auto",
              },
            },
            blockDroppingChildrenInside: true,
          },
        ],
        states: {
          hover: {
            bg: "Neutral.6",
          },
          checked: {
            bg: "Success.3",
          },
        },
      },
    ],
  };
};
