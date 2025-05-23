import { PromptParams } from "@/types/prompt-types";
import { MantineThemeExtended } from "@/types/types";

export const getTemplatePrompt = ({
  pageName,
  pageDescription,
  appDescription,
  appIndustry,
  templates,
}: PromptParams) => `
  You are a Template Recommendation Engine (TRE). Your task is to recommend the most suitable template for a web page based on the provided information about the 
  page and app. Use the details of each template such as page type, template name, and tags to find the best match. Follow the instructions below to form your 
  recommendation: 
  
  1. Analyze the page name and description to understand the content and purpose of the web page.
    Page Name: ${pageName}
    Page Description: ${pageDescription}
  2. Consider the app description and industry to ensure the template resonates with the overall app lore and audience.
    App Description: ${appDescription}
    App Industry: ${appIndustry}
  3. Review the list of available templates. Each template has a page type, template name, and tags that should guide your selection process.
  
  ${JSON.stringify(templates)}
  
  4. Based on this information, identify which template from the list would be the optimal fit. Consider aspects such as the relevance of the template to the 
  page content, how well it fits into the app's context, and the applicability of the tags related to the page's and app's needs.
  Your output should include the following:
  
  - The chosen template name that adheres to the below Typescript type in JSON.

  type Template = {
    name: string;
  };
  
  Remember TRE, you should select only one template and provide your recommendation in a structured JSON format, so that it can be easily parsed by a JSON parser.
  `;

export const getPageGenerationPrompt = ({
  pageName,
  pageDescription,
  appDescription,
  appIndustry,
  entities,
  templateNames,
}: PromptParams) => `
  You are a Page Generator System (PGS). Given a list of entities, the page description, app description and app industry respond with the structure of the Page.
  The page structure of the response must match the Page Typescript type:

  ${templateNames}

  type Page = {
    template: Template
  }

  The entities are just as a reference so you know which type of data could be there in the page, but you should use your own data.
  The data inside Chart tiles must always be valid json as we will be parsing them too.
  The return must be in JSON format. Make sure it's valid JSON as we will be parsing it using JSON.parse.
  Don't prepend or append anything, just return the JSON. Whatever you return will go straight through JSON.parse.
    
  ENTITIES: ${entities}
  PAGE NAME: ${pageName}
  PAGE DESCRIPTION: ${pageDescription}
  APP DESCRIPTION: ${appDescription}
  APP INDUSTRY: ${appIndustry}
`;

export const getPagesPrompt = ({
  appDescription,
  appIndustry,
  entities,
  pageCount,
}: PromptParams) => `
  You are a Web App Page & Feature Generator System (WAPFGS). By analyzing an app description, industry, and the entities that can be used 
  on a web app, respond with a list of ${pageCount} page names and two essential features on a page that are descriptive, relevant and unique.

  The response must match the Pages Typescript type:

  type Page = {
    name: string; Must have a space in between each word e.g "Climate Dashboard"
    // max two features
    features: string[];
  }

  type Pages = {
    pages: Page[];
  };

  The return type must be in JSON format so make sure it's valid JSON as it will be parsed using JsonSerializer.Deserialize<Pages>(response).
  Include two essential features for each page. Each feature should be described concisely that clarifies its purpose.
  Some examples of some page types are Dashboard, Profile, Settings, Form, Details, Search, Database, Report, Listing, Feed, Wizard etc.
  
  APP DESCRIPTION: ${appDescription}
  APP INDUSTRY: ${appIndustry}
  ENTITIES: ${entities}
`;

export const getPagePrompt = ({
  appDescription,
  appIndustry,
  entities,
  excludedPages,
}: PromptParams) => `
  You are a Web App Page & Feature Generator System (WAPFGS). By analyzing an app description, industry, and the entities that can be used 
  on a web app, respond with 1 new page that is descriptive, relevant and unique and two essential features.
  I already have the following pages ${excludedPages} so do not use including any similar.

  The response must match the Page Typescript type:

  type Page = {
    name: string; Must have a space in between each word e.g "Climate Dashboard"
    // max two features
    features: string[];
  }

  The return type must be in JSON format so make sure it's valid JSON as it will be parsed using JsonSerializer.Deserialize<Pages>(response).
  Include two essential features for the page. Each feature should be described concisely that clarifies its purpose.
  Remember to only return a single page.
  Some examples of some page types are Dashboard, Profile, Settings, Form, Details, Search, Database, Report, Listing, Feed, Wizard etc.

  APP DESCRIPTION: ${appDescription}
  APP INDUSTRY: ${appIndustry}
  ENTITIES: ${entities}
`;

export const getEntitiesPrompt = ({
  appDescription,
  appIndustry,
}: PromptParams) => `
  Given an app description and app industry, respond with a list of entities that the app would need.
  The data structure must match the Data Typescript type:

  type Entity = {
    id: 'faker.datatype.uuid';
    [key: string]: any;
  };

  type Data = {
    // the key is the entity name
    entities: { [key: string]: Entity };
  };

  You can use faker.js to generate fake data. For example, faker.image.avatar will generate a random avatar image url.
  For example, the person entity could have the following data structure:

  {
    name: 'faker.name.fullName',
    email: 'faker.internet.email',
  }

  The data must consider how the entities interact with each other. For example, a person entity could have a list of friends, or a list of posts.
  If it does need a list of friends, for example, it should just state the type of entity list it needs, like:
  
  {
    // the pattern is entity.<entity-name>.list for lists
    friends: 'entity.person.list',
    // the pattern is entity.<entity-name>.item for a single item
    bestFriend: 'entity.person.item',
  }

  The return must be in JSON format. Make sure it's valid JSON as we will be parsing it using JSON.parse.
  Don't prepend or append anything,just return the JSON. Whatever you return will go straight through JSON.parse.

  APP DESCRIPTION: ${appDescription}
  APP INDUSTRY: ${appIndustry}
`;

export const getComponentsPrompt = ({ description }: PromptParams) => `

As a WACBG, you should only respond with a TOML file containing the structure of the user input request

The structure of the TOML response must match the Typescript types:

TypeScript Types:
${_componentTypes()}

The TOML generated by you will be parsed to JSON and then transformed in jsx components. Make sure it's valid TOML so it can be parsed.

Remember, only respond with TOML and should strictly follow these rules:

- The TOML file should be valid TOML so it can be parsed to JSON. For example the below should parse

import TOML from "@iarna/toml"; 
const json = TOML.parse(stream);

- Use [[rows]] [[rows.components]] as the TOML file start; ensure it's JSON-parsable.
- Limit to one [[rows]] root.
- Detail components, properties, and children extensively, following TOML syntax.
- No duplicate keys within the same parent.
- Always include flexDirection for Container's style prop.
- Minimize Container usage for better HTML structure.
- Exclude navigation components.
- Always nest Tables within a Container alongside a Title.
- Container must have flex styling under a style key in props.
- Set Title's order prop to a value between 1-6.
- Use Button's value prop for text.
- Container can act as different wrappers (e.g., Card, List) with proper props.
- Skip color styling.
- If using Form fields, nest them under a Form component.
- Chart component can have columns 6 for 50% width.
- Keep all props on a single line for JSON parsing.

USER_INPUT: ${description}
`;

export const getFunctionalityPrompt = ({ description }: PromptParams) => `

You are a Web App Product Expert Generator System (WAPEGS). Please analyze the app description and list out features I need to think about to build this app.
Think from a front end and back end perspective.

The structure of the response must match the ProductDetail TypeScript type and return in JSON reponse format: 

type ProductDetail = {
  features: Feature[];
};

type Feature = {
  type: "FRONT_END" | "BACK_END";
  name: string;
  description: string;
};

Key Requirements: 

- Return the ProductDetail object in JSON format so I can parse by doing JsonSerializer.Deserialize<ProductDetail>(response).
- The features should include its type, feature name and a description.

APP_DESCRIPTION: ${description}

Remember LSCGS, you must return in JSON format only as I will parse the response using JSON.parse(<RESPONSE>).
There is no need to include the starting JSON quotes.
Do not explain the response, it has to be JSON only
`;

export const getComponentScreenshotPrompt = ({
  description,
  theme,
}: PromptParams) => `

You are a Layout & Styling Component Generator System (LSCGS), tasked with generating a strict JSON representation of a provided layout screenshot using the TypeScript Layout type definition. The output should accurately mirror the grid structure, visual hierarchy, component styling, and component types seen in the screenshot, including charts or iconography. Map screenshot elements to Mantine UI v6 components and Tabler icons where applicable. Provide precise styling details in the JSON output to replicate the screenshot accurately. The JSON should be ready to parse using JsonSerializer.Deserialize<Layout>(response) without any comments or non-JSON syntax.

While examining the screenshot, adhere to these specific requirements:

Detailed Grid Structure Analysis:
- Grid Hierarchy: Ensure that Grid components only contain GridColumn components as direct children. This is essential for maintaining the correct structural hierarchy in the layout.
- Component Nesting: Place other components, such as Card, within GridColumn components. Card or similar components should not be direct children of Grid but nested inside GridColumn.
- Grid Structure: Reflect the layout's grid properties, including gridTemplateColumns, gridTemplateRows, gridColumnGap, gridRowGap, and others as seen in the screenshot.

Visual Hierarchy Representation:
- Reflect the visual hierarchy in the JSON with nested components where necessary, keeping the parent-child-sibling relationships intact.
- You must replicate the exact layout of the screenshot using grid unless mentioned in Specific Requirements.
- Make sure you replicate the correct gridTemplateRows and gridTemplateColumns as per the screenshot.

Styling Precision:
- Translate the styling of elements from the screenshot into JSON 'style' properties with exact values for all styling properties such as gaps between components, width, height, margins, paddings, font sizes, colors, etc.
- Use the Color with the correct shade of Color, the 6th shade is the default.
- The text color must adhere to the Web Content Accessibility Guidelines (WCAG) to ensure readability.
- The hex colors are provided in the comments for each color for your reference on what color to choose, do not use the hex value, use the Color type properties.

Component Mapping:
- Map visual elements to the closest corresponding Mantine UI v6 components.
- Make sure to use the exact name of the Component set in its TypeScript type.
- You should validate the JSON against the TypeScript type definition to ensure the JSON is valid.
- Breadcrumbs should use the separator prop to match the screenshot.

Iconography with Tabler Icons:
- Identify icons in the screenshot and match them to Tabler icons, (https://tabler-icons-react.vercel.app).
- Include the appropriate Tabler icon names in the JSON props section using the name as the icon for example IconAB, IconOneTwoThree etc.

Fake Images with Faker.js v7:
- You must use faker.js to generate fake image function URLs for images and avatars.
- For example you should return a function such as faker.image.imageUrl(1234, 2345, 'flag', true) or faker.image.avatar() for avatars.
- If avatars or images are circle then use radius xl.

Chart Components:
- apexcharts is the chart library used.
- Identify the chart types in the screenshot.
- Inspect the screenshot and copy its width in pixels and apply it to props.style, no need to worry about height.
- Do not explain or comment within the Chart JSON, so no need to comment on data, just strictly supply the data.

JSON Parsing:
- Return in JSON format only as I will parse the response using JsonSerializer.Deserialize<Layout>(response).
- Do not include the starting / ending JSON quotes.
- Do not explain or comment, it MUST be JSON only.

Specific Requirements:
- ${description ?? "Copy the screenshot to your best ability"}

TypeScript Types:
type Layout = {
  components: Grid[];
};

${_componentTypes(theme)}

Remember LSCGS, provide the JSON in a format that's directly usable with the provided type definitions, ensuring that the names of components 
and properties match those expected by Mantine UI and the TypeScript Layout type definition.

- Return in JSON format only as I will parse the response using JsonSerializer.Deserialize<Layout>(response).
- The response type must be JSON.
- Props and Style can't be empty, leave them out if they are not needed.
`;

export const getComponentsJsonPrompt = ({
  description,
  theme,
}: PromptParams) => `
You are a Layout & Styling Component Generator System (LSCGS), your task is to generate a strict JSON representation of the provided User Request 
using the TypeScript Row type definition. The output should mirror the layout's flex structure, visual hierarchy, component styling, and component 
types, including any charts or iconography present. Map elements to Mantine UI v6 components and Tabler icons where applicable. 
The JSON should be ready to parse using JsonSerializer.Deserialize<Row>(response) without any comments or non-JSON syntax.

User Request:
- ${description}

Component Mapping:
- Map visual elements to the closest corresponding Mantine UI v6 components.
- Make sure to use the exact name of the Component set in its TypeScript type.
- You should validate the JSON against the TypeScript type definition to ensure the JSON is valid.
- Breadcrumbs should use the separator prop to match the screenshot.

Chart Components:
- apexcharts is the chart library used.
- Do not explain or comment within the Chart JSON, so no need to comment on data, just strictly supply the data.

Iconography with Tabler Icons:
- If icons are applicable get them from Tabler icons, (https://tabler-icons-react.vercel.app).
- Include the appropriate Tabler icon names in the JSON props section using the name as the icon for example IconAB, IconOneTwoThree etc.

JSON Parsing:
- Return in JSON format only as I will parse the response using JsonSerializer.Deserialize<Row>(response).
- Do not include the starting / ending JSON quotes.
- Do not explain or comment, it MUST be JSON only.

TypeScript Types:
type Row = {
  components: Component[];
};
${_componentTypes(theme)}

Remember LSCGS, you must: 

- Return in JSON format only as I will parse the response using JsonSerializer.Deserialize<Row>(response).
- The response type must be JSON.
- Props and Style can't be empty, leave them out if they are not needed.
`;

const _componentTypes = (theme?: MantineThemeExtended) => `


type Grid = BaseComponent & {
  name: "Grid";
  props: {
    style: {
      gridTemplateColumns: string; // e.g., 'repeat(3, 1fr)' or '200px 1fr 200px'
      gridTemplateRows?: string; // e.g., 'repeat(2, 100px)' or 'auto'
      gridColumnGap: string; // e.g., '10px'
      gridRowGap: string; // e.g., '10px'
      justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
      alignItems: 'start' | 'end' | 'center' | 'stretch';
      padding: string;
      [key: string]: any;
    };
  };
  children: GridColumn[];
};

type GridColumn = BaseComponent & {
  name: "GridColumn";
  props: {
    style: {
      gridColumnStart?: string; // e.g., '1', '2', etc.
      gridColumnEnd?: string; // e.g., 'span 2', '3', etc.
      gridRowStart?: string; // Optional: Defines the row start for the item
      gridRowEnd?: string; // Optional: Defines the row end for the item
      justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'; // Optional: Horizontal alignment
      alignSelf?: 'start' | 'end' | 'center'; // Optional: Vertical alignment
      padding?: string;
      [key: string]: any;
    };
  };
  children: Component[];
};

type CardChildren = Exclude<Component, Card>[];
type Card = GridColumn & {
  name: "Card";
  children: CardChildren[];
};

type BaseComponent = {
  name: string;
  description: string;
  children?: Component[];
  props?: {
    [key: string]: any;
    style: {
      [key: string]: any;
    };
  };
};

// The comment is the hex value of the color so you know which color to use for the screenshot.
type Color =
  | "Primary.6" // ${theme?.colors["Primary"][6]}
  | "PrimaryText.6" // ${theme?.colors["PrimaryText"][6]}
  | "Secondary.6" // ${theme?.colors["Secondary"][6]}
  | "SecondaryText.6" // ${theme?.colors["SecondaryText"][6]}
  | "Tertiary.6" // ${theme?.colors["Tertiary"][6]}
  | "TertiaryText.6" // ${theme?.colors["TertiaryText"][6]}
  | "Background.6" // ${theme?.colors["Background"][6]}
  | "Border.6" // ${theme?.colors["Border"][6]}
  | "Neutral.6" // ${theme?.colors["Neutral"][6]}
  | "Black.6"
  | "White.6";

type TextColor = "Black.6" | "White.6";

type MatchTextColor<C extends Color> = C extends "Primary.6"
  ? "PrimaryText.6"
  : C extends "Secondary.6"
  ? "SecondaryText.6"
  : C extends "Tertiary.6"
  ? "TertiaryText.6"
  : C extends "Background.6"
  ? never // Assuming no corresponding text color for Background
  : C extends "Border.6"
  ? never // Assuming no corresponding text color for Border
  : C extends "Neutral.6"
  ? never // Assuming no corresponding text color for Neutral
  : C extends "Black.6"
  ? never // Assuming no corresponding text color for Black
  : C extends "White.6"
  ? never // Assuming no corresponding text color for White
  : never;

type MantineSize = "xs" | "sm" | "md" | "lg" | "xl";

type AppBar = BaseComponent & {
  name: "AppBar";
  props: {
    style: {
      gridTemplateColumns: string; // e.g., 'auto 1fr auto'
      justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
      alignItems: 'center';
      gridColumnGap: string; // e.g., '10px'
      padding: string; // e.g., '10px'
      [key: string]: any;
    };
  };
  children: GridColumn[]; // Can include ButtonIcon, Title, Avatar, Link, Image within GridColumn
};


type Navbar = BaseComponent & {
  name: "Navbar";
  props: {
    style: {
      gridTemplateRows: "auto 1fr auto",
      justifyContent: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly';
      alignItems: 'center';
      gap: string;
      padding: string;
      [key: string]: any;
    };
  };
  children: GridColumn[]; // Should be three parts. One for logo, one for nav links, and one for profile footer
};

// You must use color and textColor on props and not style, that is why they are Omitted.
type Button = BaseComponent & {
  name: "Button";
  props: {
    value: string;
    color: Color;
    textColor: MatchTextColor<Color>;
    [key: string]: string;
  } & (
    | { leftIcon: string; rightIcon?: never } // Use icons from https://tabler-icons-react.vercel.app/ for example IconTrendingUp
    | { leftIcon?: never; rightIcon: string } // Use icons from https://tabler-icons-react.vercel.app/ for example IconTrendingUp
    | { leftIcon?: never; rightIcon?: never }
  );
  style: Omit<React.CSSProperties, "color" | "backgroundColor">;
};
type Link = BaseComponent & {
  name: "Link";
  props: { value: string; [key: string]: string };
};

// A text input that is not multiline
type Input = BaseComponent & {
  name: "Input";
  props: { label: string; placeholder: string; [key: string]: string };
};

// A text input that is multiline
type Textarea = BaseComponent & {
  name: "Textarea";
};

type Select = BaseComponent & {
  name: "Select";
  props: {
    label: string;
    placeholder: string;
    data: { [key: string]: string }[];
    [key: string]: string;
  };
};
type Checkbox = BaseComponent & { name: "Checkbox" };
type RadioItem = BaseComponent & {
  name: "RadioItem";
  props: { value: string; label: string; [key: string]: string };
};
type Radio = BaseComponent & {
  name: "Radio";
  props: { label: string; [key: string]: string };
  children: RadioItem[];
};
type Switch = BaseComponent & {
  name: "Container";
  description: "Switch Container";
  children: [
    {
      name: "Switch";
    },
    {
      name: "Text";
      props: {
        value: string;
        color: TextColor;
      };
    }
  ];
};

type DateInput = BaseComponent & {
  name: "DateInput";
};

type Form = BaseComponent & {
  name: "Form";
  children:
    | Input
    | DateInput
    | Text
    | Button
    | Select
    | Switch
    | Checkbox
    | Radio
    | Rating
    | Textarea;
};

type ButtonIcon = BaseComponent & {
  name: "ButtonIcon";
  props: { variant: "filled" | "default"; radius: MantineSize };
  children: [Icon];
}; // This is mantine ActionIcon. It is a button with an icon only.
type Rating = BaseComponent & {
  name: "Rating";
  props: { value: 0 | 1 | 2 | 3 | 4 | 5 };
};
type FileButton = BaseComponent & {
  name: "FileButton";
  props: { accept: string };
  children: [Button];
};

// This is Mantine's Dropzone
type FileUpload = BaseComponent & {
  name: "FileUpload";
  children: [Grid];
};

type Title = BaseComponent & {
  name: "Title";
  props: { order: 1 | 2 | 3 | 4 | 5 | 6; value: string; [key: string]: string };
};
type Text = BaseComponent & {
  name: "Text";
  props: { value: string; color: TextColor; [key: string]: string }; // Color is a prop for Text, not a style
};

type Table = BaseComponent & {
  name: "Table";
  props: { data: { [key: string]: string }[] };
};
type Icon = BaseComponent & { name: "Icon"; props: { name: string } }; // Use icons from https://tabler-icons-react.vercel.app/ for example IconTrendingUp
type Image = BaseComponent & {
  name: "Image";
  props: {
    src: string; // The faker.js function name including parameters such as faker.image.imageUrl(1234, 2345, 'cat', true)
    alt?: string;
    fit?: string;
    position?: string;
    style: { width: string; height: string; [key: string]: any };
    [key: string]: string;
  };
};
type Divider = BaseComponent & {
  name: "Divider";
  props: { label: string; labelPosition: "center"; [key: string]: string };
};

type Avatar = BaseComponent & {
  name: "Avatar";
  props: (
    | {
        src: "faker.image.avatar()";
        value?: never;
      }
    | {
        src?: never;
        value: string; // Max two characters, e.g. "AB"
      }
  ) & {
    color: Color;
    radius: MantineSize; // If Avatar is a circle then use xl
    size: MantineSize;
  };
};

type Accordion = BaseComponent & { name: "Accordion" };

type Breadcrumb = BaseComponent & {
  name: "Breadcrumb";
  children: [...Link[], Text]; // The last item in the array is the current page so no need to have a link
  separator: "." | "/" | ">" | "-" | "•••" | "..." | ">>>" | ">" | string;
};
type Tab = BaseComponent & {
  name: "Tab";
  props: { value: string; icon: Icon };
  children: [Text];
};
type TabsList = BaseComponent & { name: "TabsList"; children: Tab[] };
type TabsPanel = BaseComponent & {
  name: "TabsPanel";
  children: [Grid];
};
type Tabs = BaseComponent & {
  name: "Tabs";
  props: { defaultValue: string };
  children: TabsList[] | TabsPanel[]; // Uses Mantine Tabs.List and Tabs.Panel
};

type Alert = BaseComponent & {
  name: "Alert";
  props: { title: string; color: Color };
};
type Badge = BaseComponent & {
  name: "Badge";
  props: { value: string; color: Color; size: MantineSize };
};

type CommonChartProps = {
  series: Array<{ name: string; data: number[] }>;
  options: {};
  props?: {
    style: {
      width: "<number>px" | "100%";
      [key: string]: any;
    };
  };
};

type XAxisProps = { xaxis: { categories: string[] } };
type PieChart = {
  name: "PieChart";
  props: {
    series: number[];
    labels: string[];
  };
};
type RadarChart = { name: "RadarChart"; props: CommonChartProps & XAxisProps };
type BarChart = { name: "BarChart"; props: CommonChartProps & XAxisProps };
type LineChart = { name: "LineChart"; props: CommonChartProps & XAxisProps };
type AreaChart = { name: "AreaChart"; props: CommonChartProps & XAxisProps };
type RadialChart = {
  name: "RadialChart";
  props: CommonChartProps & XAxisProps;
};

type Component =
  | Accordion
  | Alert
  | AreaChart
  | AppBar
  | Avatar
  | BarChart
  | Badge
  | Breadcrumb
  | Button
  | ButtonIcon
  | Card
  | Checkbox
  | DateInput
  | Divider
  | FileButton
  | FileUpload
  | Form
  | Grid
  | GridColumn
  | Input
  | Icon
  | Image
  | Link
  | Navbar
  | Radio
  | Rating
  | Select
  | Switch
  | Textarea
  | Table
  | Tabs
  | Text
  | Title
  | LineChart
  | PieChart
  | RadarChart
  | RadialChart

`;
