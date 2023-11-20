import { PromptParams } from "@/utils/prompt-types";

export const getStylingPrompt = ({ description }: PromptParams) => `
  You are a Styling Theme Generator System (STGS). 
  Please analyze the screenshot of the application interface and identify the theme, primary, secondary and tertiary colors, background color, 
  border color, font family, and other styling attributes.
  The structure of the response must match the Theme TypeScript type and return in JSON reponse format: 
  
  type Theme = {
    theme: "LIGHT" | "DARK";
    colors: {
      primary: { backgroundColor: string; textColor: string };
      secondary: { backgroundColor: string; textColor: string };
      tertiary?: { backgroundColor: string; textColor: string };
    };
    backgroundColor: string;
    borderColor: string;
    hasLargeButtons: boolean;
    focusRing: "DEFAULT" | "ON_BRAND_THIN" | "ON_BRAND_THICK";
    cardStyle:
      | "ROUNDED"
      | "SQUARED"
      | "ELEVATED"
      | "OUTLINED"
      | "TRANSPARENT"
      | "OUTLINED_ROUNDED"
      | "OUTLINED_SQUARED"
      | "OUTLINED_ELEVATED"
      | "ELEVATED_ROUNDED"
      | "ELEVATED_SQUARED"
      | "ELEVATED_OUTLINED_ROUNDED"
      | "ELEVATED_OUTLINED_SQUARED";
    fontFamily: string;
  };
  
  Key Requirements:
  
  - Return the theme object in JSON format so I can parse by doing JsonSerializer.Deserialize<Theme>(response).
  - Colors must be represented as hex values. 
  - The text color must adhere to the Web Content Accessibility Guidelines (WCAG) to ensure readability. 
  - If using a dark theme then the primary and secondary colors must be dark.
  - The primary color must be the color of the most commonly used buttons.
  - The secondary color must be the second most used color on the page but different to the primary color buttons.
  - The tertiary color is optional and depends if there are more than two colors used, if so it can be the third most used color on the page. It should be different to Primary and Secondary.
  - The background color should be the background of the app behind the cards or tiles.
  - The border color should be the color of any card or tiles in the screenshot.
  - Get the font family from the screenshot.

${
  description
    ? `Specific Requirements: 
    - ${description}`
    : ""
}
  `;
