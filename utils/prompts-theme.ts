import { PromptParams } from "@/utils/prompt-types";

export const getThemeScreenshotPrompt = ({ description }: PromptParams) => `
  You are a Styling Theme Generator System (STGS). 
  Please analyze the screenshot of the application interface and identify the theme, primary, secondary and tertiary colors, background color, 
  border color, font family, and other styling attributes.
  The structure of the response must match the Theme TypeScript type and return in JSON reponse format: 

  While examining the screenshot, adhere to these specific requirements:

Color Requirements: 
  - Utilize hex values for color representation.
  - Ensure text color complies with Web Content Accessibility Guidelines (WCAG) for readability.
  - If the theme is dark, primary and secondary colors should also be dark.

Color Hierarchy:
  - Primary Color: The most commonly used color for buttons on the page.
  - Secondary Color: The second most prevalent color on the page, distinct from the primary color buttons.
  - Tertiary Color: (Optional) If more than two colors are prominently used, the third most used color. It should differ from both primary and secondary colors.

Background and Border Colors:
  - Background Color: Derived from the app's background behind cards or tiles.
  - Border Color: Based on the color of the borders of cards or tiles in the screenshot.

Font Family:
  - Extract and specify the font family used in the screenshot.

JSON Parsing:
  - Return in JSON format only as I will parse the response using JsonSerializer.Deserialize<Theme>(response).
  - Do not include the starting / ending JSON quotes.
  - Do not explain or comment, it MUST be JSON only.
  - You should validate the JSON against the TypeScript type definition to ensure the JSON is valid.
  
  TypeScript Type Definition:

    type Theme = {
      theme: "LIGHT" | "DARK";
      colors: {
        primary: { backgroundColor: string; textColor: string };
        secondary: { backgroundColor: string; textColor: string };
        tertiary?: { backgroundColor: string; textColor: string };
      };
      backgroundColor: string;
      borderColor: string;
      hasCompactButtons: boolean; // If buttons are compact, they have less padding than standard website buttons.
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
  
Remember STGS, provide the JSON in a format that's directly usable with the provided type definitions, ensuring that the properties match 
those expected by the TypeScript Theme type definition.

- Return in JSON format only as I will parse the response using JsonSerializer.Deserialize<Theme>(response).
- The response type must be JSON.

${
  description
    ? `Specific Requirements: 
    - ${description}`
    : ""
}
  `;
