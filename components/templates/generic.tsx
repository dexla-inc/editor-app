import { nanoid } from "nanoid";

export type Data = {
  title: {
    text: string;
  };
};

export const template = (data: Data) => {
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
                        value: data.title.text,
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
