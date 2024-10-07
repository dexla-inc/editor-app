import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { NestedComponents } from "../libs/dnd-grid/NestedComponents";

const meta = {
  title: "dnd/Grid",
  component: NestedComponents,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    components: {},
  },
} satisfies Meta<typeof NestedComponents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    components: {
      id: "main-grid",
      name: "Container",
      description: "Container",
      blockDroppingChildrenInside: false,
      children: [
        {
          id: "V7BXq3wbqGhduq57Pj_04",
          name: "Container",
          description: "Container",
          blockDroppingChildrenInside: false,
          props: {
            bg: "bg-gray-100",
            textColor: "text-black",
            style: {
              gridColumn: "40/69",
              gridRow: "9/18",
            },
          },
          children: [
            {
              id: "oGFqO5RNPd1u1ptj-FbIK",
              name: "Button",
              description: "Button",
              blockDroppingChildrenInside: true,
              props: {
                bg: "bg-blue-500",
                textColor: "text-white",
                style: {
                  gridColumn: "2/13",
                  gridRow: "3/7",
                },
              },
            },
            {
              id: "JzVEIvdwuNVUIgLCe0C_o",
              name: "Text",
              description: "Text",
              blockDroppingChildrenInside: true,
              props: {
                bg: "bg-white",
                textColor: "text-black",
                style: {
                  gridColumn: "22/27",
                  gridRow: "4/6",
                },
              },
            },
          ],
        },
      ],
    },
  },
};
