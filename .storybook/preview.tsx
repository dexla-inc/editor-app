import type { Preview } from "@storybook/react";
import { MantineProvider } from "@mantine/core";

// const preview: Preview = {
//   parameters: {
//     controls: {
//       matchers: {
//         color: /(background|color)$/i,
//         date: /Date$/i,
//       },
//     },
//   },
// };

export const decorators = [
  (renderStory: any) => <MantineProvider>{renderStory()}</MantineProvider>,
];
