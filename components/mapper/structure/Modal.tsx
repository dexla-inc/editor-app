import { structureMapper } from "@/utils/componentMapper";
import { ComponentStructure } from "@/utils/editor";
import { requiredModifiers } from "@/utils/modifiers";
import merge from "lodash.merge";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): ComponentStructure => {
  const { input: defaultInputValues, modal: defaultModalValues } =
    requiredModifiers;

  const modalId = nanoid();

  // const containerItem = structureMapper["Container"].structure({});

  // const defaultChildren = [
  //   {
  //     id: nanoid(),
  //     name: "Container",
  //     description: "Modal Container",
  //     props: {
  //       style: {
  //         width: "auto",
  //         height: "auto",
  //         gridColumn: "1/-1",
  //         gridRow: "1/-1",
  //         display: "grid",
  //         gridTemplateColumns: "subgrid",
  //         gridTemplateRows: "subgrid",
  //       },
  //       gap: "sm",
  //     },
  //     children: [
  //       {
  //         id: nanoid(),
  //         name: "Container",
  //         description: "Name Modal Container",
  //         props: {
  //           style: {
  //             width: "100%",
  //             backgroundColor: "white.6",
  //           },
  //           gap: "sm",
  //         },
  //         children: [
  //           {
  //             id: nanoid(),
  //             name: "Input",
  //             description: "Input",
  //             props: {
  //               style: {
  //                 width: "100%",
  //               },
  //               ...defaultInputValues,
  //               placeholder: "Your First Name",
  //               label: "First Name",
  //             },
  //             blockDroppingChildrenInside: true,
  //           },
  //           {
  //             id: nanoid(),
  //             name: "Input",
  //             description: "Input",
  //             props: {
  //               style: {
  //                 width: "auto",
  //                 height: "auto",
  //                 display: "grid",
  //                 gridTemplateColumns: "subgrid",
  //                 gridTemplateRows: "subgrid",
  //                 gridColumn: "1 / 30",
  //                 gridRow: "1 / 5",
  //               },
  //               ...defaultInputValues,
  //               placeholder: "Your Last Name",
  //               label: "Last Name",
  //             },
  //             blockDroppingChildrenInside: true,
  //           },
  //         ],
  //       },
  //       {
  //         id: nanoid(),
  //         name: "Input",
  //         description: "Input",
  //         props: {
  //           style: {
  //             width: "auto",
  //             height: "auto",
  //             display: "grid",
  //             gridTemplateColumns: "subgrid",
  //             gridTemplateRows: "subgrid",
  //             gridColumn: "1 / 30",
  //             gridRow: "1 / 5",
  //           },
  //           ...defaultInputValues,
  //           placeholder: "Your Email",
  //           label: "Email",
  //           type: "email",
  //         },
  //         blockDroppingChildrenInside: true,
  //       },
  //       {
  //         id: nanoid(),
  //         name: "Input",
  //         description: "Input",
  //         props: {
  //           style: {
  //             width: "auto",
  //             height: "auto",
  //             display: "grid",
  //             gridTemplateColumns: "subgrid",
  //             gridTemplateRows: "subgrid",
  //             gridColumn: "1 / 30",
  //             gridRow: "1 / 5",
  //           },
  //           ...defaultInputValues,
  //           placeholder: "Password",
  //           label: "Password",
  //           type: "password",
  //         },
  //         blockDroppingChildrenInside: true,
  //       },
  //       {
  //         id: nanoid(),
  //         name: "Input",
  //         description: "Input",
  //         props: {
  //           style: {
  //             width: "auto",
  //             height: "auto",
  //             display: "grid",
  //             gridTemplateColumns: "subgrid",
  //             gridTemplateRows: "subgrid",
  //             gridColumn: "1 / 30",
  //             gridRow: "1 / 5",
  //           },
  //           ...defaultInputValues,
  //           placeholder: "Confirm Password",
  //           label: "Confirm Password",
  //           type: "password",
  //         },
  //         blockDroppingChildrenInside: true,
  //       },
  //     ],
  //   },
  //   {
  //     id: nanoid(),
  //     name: "Checkbox",
  //     description: "Checkbox",
  //     props: {
  //       label: "I agree with the terms and conditions",
  //       style: {
  //         width: "100%",
  //       },
  //     },
  //     blockDroppingChildrenInside: true,
  //   },
  //   {
  //     id: nanoid(),
  //     name: "Link",
  //     description: "Link",
  //     props: {
  //       children: "Have an account? Login",
  //       color: "Black.6",
  //     },
  //     blockDroppingChildrenInside: true,
  //   },
  //   {
  //     id: nanoid(),
  //     name: "Button",
  //     description: "Button",
  //     props: {
  //       children: "Register",
  //       style: {
  //         width: "fit-content",
  //         //padding: px(theme.spacing.sm),
  //         alignSelf: "center",
  //       },
  //       textColor: "White.6",
  //     },
  //     blockDroppingChildrenInside: true,
  //   },
  // ];

  // const modalContainerProps = merge({}, containerItem.props, {
  //   style: {
  //     display: "flex",
  //     gridArea: "1/1/-1/-1",
  //     // width: "100%",
  //     // flexDirection: "column",
  //     // justifyContent: "center",
  //   },
  // });

  return {
    id: modalId,
    name: "Modal",
    description: "Modal",
    props: {
      ...(props.props || {}),
      ...defaultModalValues,
    },
    onLoad: {
      isVisible: {
        dataType: "static",
        static: true,
      },
      showInEditor: {
        dataType: "static",
        static: true,
      },
    },
    children: [
      {
        id: nanoid(),
        name: "Input",
        description: "Input",
        props: {
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / 96",
            gridRow: "1 / 5",
          },
          ...defaultInputValues,
          placeholder: "Your First Name",
          label: "First Name",
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Input",
        description: "Input",
        props: {
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "1 / 96",
            gridRow: "6 / 10",
          },
          ...defaultInputValues,
          placeholder: "Your Last Name",
          label: "Last Name",
        },
        blockDroppingChildrenInside: true,
      },
      {
        id: nanoid(),
        name: "Button",
        description: "Button",
        props: {
          children: "Register",
          style: {
            width: "auto",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "subgrid",
            gridTemplateRows: "subgrid",
            gridColumn: "40 / 58",
            gridRow: "15 / 19",
          },
          textColor: "White.6",
        },
        blockDroppingChildrenInside: true,
      },
    ],
  };
};
