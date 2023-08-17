import { nanoid } from "nanoid";

type Input = {
  placeholder: string;
  label: string;
  type: "text" | "email" | "password";
};

export type Data = {
  inputs: Input[];
  button: {
    text: string;
  };
  title: {
    text: string;
  };
};

export const template = (data: Data) => {
  const inputs = data.inputs.map((input: Input) => {
    return {
      id: nanoid(),
      name: "Input",
      description: "Input",
      props: {
        style: {
          width: "100%",
          height: "auto",
          flexDirection: "column",
        },
        size: "sm",
        placeholder: input.placeholder,
        type: input.type,
        label: input.label,
        icon: "",
        withAsterisk: false,
        labelSpacing: "0",
      },
      blockDroppingChildrenInside: true,
    };
  });

  return {
    root: {
      id: "root",
      name: "Container",
      description: "Root Container",
      props: { style: { width: "100%" } },
      children: [
        {
          id: "content-wrapper",
          name: "Container",
          description: "Root Container",
          props: {
            style: {
              width: "100%",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              minHeight: "50px",
            },
          },
          children: [
            {
              id: nanoid(),
              name: "Container",
              description: "Container",
              props: {
                style: {
                  width: "100%",
                  paddingTop: "20px",
                  paddingRight: "20px",
                  paddingBottom: "20px",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100vh",
                  alignItems: "center",
                  justifyContent: "center",
                },
                bg: "Neutral.4",
              },
              children: [
                {
                  id: nanoid(),
                  name: "Image",
                  description: "Image",
                  props: {
                    withPlaceholder: true,
                    style: {
                      width: "auto",
                      height: "100px",
                      objectFit: "contain",
                      marginBottom: "20px",
                    },
                    src: "https://www.kadencewp.com/wp-content/uploads/2020/10/alogo-4.svg",
                    alt: "Logo",
                    objectFit: "contain",
                  },
                  blockDroppingChildrenInside: true,
                },
                {
                  id: nanoid(),
                  name: "Container",
                  description: "Container",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      rowGap: "30px",
                      columnGap: "20px",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      borderTopStyle: "solid",
                      borderRightStyle: "solid",
                      borderBottomStyle: "solid",
                      borderLeftStyle: "solid",
                      borderTopWidth: "1px",
                      borderRightWidth: "1px",
                      borderBottomWidth: "1px",
                      borderLeftWidth: "1px",
                      borderTopColor: "rgba(230, 230, 230, 1)",
                      borderRightColor: "rgba(230, 230, 230, 1)",
                      borderBottomColor: "rgba(230, 230, 230, 1)",
                      borderLeftColor: "rgba(230, 230, 230, 1)",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                      paddingTop: "40px",
                      paddingBottom: "40px",
                      paddingLeft: "40px",
                      paddingRight: "40px",
                      width: "400px",
                      height: "auto",
                      minHeight: "10px",
                      borderStyle: "solid",
                      borderWidth: "1px",
                      borderColor: "rgba(230, 230, 230, 1)",
                    },
                    bg: "White.0",
                  },
                  children: [
                    {
                      id: nanoid(),
                      name: "Title",
                      description: "Title",
                      children: [],
                      props: {
                        children: data.title.text,
                        color: "Black.6",
                        order: 2,
                        style: {
                          fontWeight: "bold",
                          fontSize: "1.625rem",
                          lineHeight: 1.35,
                          width: "auto",
                          height: "auto",
                          marginBottom: "0px",
                        },
                      },
                      blockDroppingChildrenInside: true,
                    },
                    {
                      id: nanoid(),
                      name: "Form",
                      description: "Form",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          rowGap: "25px",
                          columnGap: "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          borderTopStyle: "none",
                          borderRightStyle: "none",
                          borderBottomStyle: "none",
                          borderLeftStyle: "none",
                          borderTopWidth: "0px",
                          borderRightWidth: "0px",
                          borderBottomWidth: "0px",
                          borderLeftWidth: "0px",
                          borderTopColor: "Border.6",
                          borderRightColor: "Border.6",
                          borderBottomColor: "Border.6",
                          borderLeftColor: "Border.6",
                          borderTopLeftRadius: "0px",
                          borderTopRightRadius: "0px",
                          borderBottomLeftRadius: "0px",
                          borderBottomRightRadius: "0px",
                          paddingLeft: "0px",
                          paddingRight: "0px",
                          marginBottom: "0px",
                          width: "100%",
                          height: "auto",
                          minHeight: "auto",
                        },
                      },
                      children: [
                        ...inputs,
                        {
                          id: nanoid(),
                          name: "Button",
                          description: "Button",
                          props: {
                            style: {
                              width: "100%",
                              height: "auto",
                              paddingTop: 12,
                              paddingBottom: 12,
                              paddingLeft: 20,
                              paddingRight: 20,
                            },
                            textColor: "White.0",
                          },
                          children: data.button.text,
                          blockDroppingChildrenInside: true,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
};
