import type { Meta, StoryObj } from "@storybook/react";

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

export const Default: Story = {};
