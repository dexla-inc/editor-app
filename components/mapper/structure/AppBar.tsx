import { defaultTheme } from "@/components/IFrame";
import { defaultBorderValues } from "@/components/modifiers/Border";
import { Component } from "@/utils/editor";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

export const jsonStructure = (props?: any): Component => {
  const theme = props.theme ?? defaultTheme;

  return {
    id: nanoid(),
    name: "AppBar",
    description: "Page Heading",
    fixedPosition: { position: "top", target: "content-wrapper" },
    props: {
      style: {
        ...defaultBorderValues,
        borderBottomWidth: `1px`,
        borderBottomStyle: `solid`,
        borderBottomColor: theme.colors.Border ? "Border.6" : "gray.3",
        paddingTop: px(theme.spacing.lg),
        paddingBottom: px(theme.spacing.lg),
        paddingLeft: px(theme.spacing.lg),
        paddingRight: px(theme.spacing.lg),
        height: "auto",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: theme.spacing.md,
      },
      ...(props.props || {}),
    },
    children: [
      {
        id: nanoid(),
        name: "Container",
        description: "Search box",
        props: {
          style: { display: "flex", alignItems: "center" },
        },
        blockDroppingChildrenInside: true,
        children: [
          {
            id: nanoid(),
            name: "Input",
            description: "Search",
            props: {
              variant: "default",
              radius: "md",
              type: "search",
              size: "sm",
              icon: {
                props: { name: "IconSearch" },
              },
              placeholder: "Search anything...",
            },
            blockDroppingChildrenInside: true,
          },
        ],
      },
      {
        id: nanoid(),
        name: "Container",
        description: "Buttons container",
        props: {
          style: {
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
          },
        },
        blockDroppingChildrenInside: true,
        children: [
          {
            id: nanoid(),
            name: "Container",
            description: "Notifications Container",
            props: {
              style: {
                width: "35px",
                height: "35px",
                overflow: "hidden",
                borderRadius: "50%",
                padding: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                type: "button",
              },
            },
            blockDroppingChildrenInside: true,
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Notifications Container",
                props: {
                  style: {
                    width: "25px",
                    height: "25px",
                    overflow: "hidden",
                    borderRadius: "50%",
                  },
                },
                blockDroppingChildrenInside: true,
                children: [
                  {
                    id: nanoid(),
                    name: "Image",
                    description: "Notifications button",
                    props: {
                      fit: "cover",
                      alt: "Notification",
                      src: "https://dexlastatesdev.blob.core.windows.net/temp/notifications.svg",
                      style: {
                        width: "25px",
                        height: "25px",
                        filter: "contrast(40%)",
                      },
                    },
                    blockDroppingChildrenInside: true,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "Container",
            description: "Settings Container",
            props: {
              style: {
                width: "35px",
                height: "35px",
                overflow: "hidden",
                borderRadius: "50%",
                padding: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                type: "button",
              },
            },
            blockDroppingChildrenInside: true,
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Settings Container",
                props: {
                  style: {
                    width: "25px",
                    height: "25px",
                    overflow: "hidden",
                    borderRadius: "50%",
                  },
                },
                blockDroppingChildrenInside: true,
                children: [
                  {
                    id: nanoid(),
                    name: "Image",
                    description: "Settings button",
                    props: {
                      fit: "cover",
                      alt: "Settings",
                      src: "https://dexlastatesdev.blob.core.windows.net/temp/settings.svg",
                      style: {
                        width: "25px",
                        height: "25px",
                        filter: "contrast(40%)",
                      },
                    },
                    blockDroppingChildrenInside: true,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: nanoid(),
            name: "Container",
            description: "Profile Container",
            props: {
              style: {
                width: "auto",
                height: "35px",
                overflow: "hidden",
                borderRadius: "50%",
                padding: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing.xs,
                cursor: "pointer",
                type: "button",
              },
            },
            blockDroppingChildrenInside: true,
            children: [
              {
                id: nanoid(),
                name: "Container",
                description: "Profile Container",
                props: {
                  style: {
                    width: "25px",
                    height: "25px",
                    overflow: "hidden",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                blockDroppingChildrenInside: true,
                children: [
                  {
                    id: nanoid(),
                    name: "Image",
                    description: "Profile Image",
                    props: {
                      fit: "contain",
                      radius: "md",
                      alt: "Profile Image",
                      src: "https://dexlastatesdev.blob.core.windows.net/temp/avatar_25.jpg",
                      style: {
                        width: "100%",
                        height: "100%",
                      },
                    },
                    blockDroppingChildrenInside: true,
                    children: [],
                  },
                ],
              },
              {
                id: nanoid(),
                name: "Title",
                description: "Title",
                props: {
                  children: "John Doe",
                  color: theme.colors.dark[7],
                  order: 5,
                  style: { fontWeight: "semibold" },
                },
                children: [],
                blockDroppingChildrenInside: true,
              },
            ],
          },
        ],
      },
    ],
  };
};
