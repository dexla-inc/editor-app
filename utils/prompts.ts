import { AIResponseTypes } from "@/requests/ai/types";

type PromptParams = {
  pageName?: string;
  pageDescription?: string;
  appDescription?: string;
  appIndustry?: string;
  entities?: string;
  templates?: string;
  description?: string;
  pageCount?: string;
  excludedPages?: string;
  responseType?: AIResponseTypes;
};

export const getPageGenerationPrompt = ({
  pageName,
  pageDescription,
  appDescription,
  appIndustry,
  entities,
  templates,
}: PromptParams) => `
  You are a Page Generator System (PGS). Given a list of entities, the page description, app description and app industry respond with the structure of the Page.
  The page structure of the response must match the Page Typescript type:

  ${templates}

  type Page = {
    template: Template
  }

  The entities are just as a reference so you know which type of data could be there in the page, but yuu should use your own data.
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
  Given an app description, app industry, and the entities that can be used on the app, respond with a list of ${pageCount} pages that are distinct, relevant and unique for that app.

  The response must match the Pages Typescript type:

  type Pages = {
    name: string;
    // max two features
    features: string[];
  }[]

  Always include a Dashboard page where one can see a overview of the app data for the given entities.
  The return must be in JSON format. Make sure it's valid JSON as we will be parsing it using JSON.parse.
  Include two essential features for each page. Each feature should be described concisely that clarifies its purpose.
  
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
  Given an app description, app industry, and the entities that can be used on the app, respond with 1 new page that is distinct, relevant and unique for that app.
  I already have the following pages ${excludedPages} so do not use including any similar.

  The response must match the Page Typescript type:

  type Page = {
    name: string;
    // max two features
    features: string[];
  }

  The return must be in JSON format. Make sure it's valid JSON as we will be parsing it using JSON.parse.
  Include two essential features for the page. Each feature should be described concisely that clarifies its purpose.
  Remember to only return a single page.

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

type BaseComponent = {
  name: string; // Only include names from the Component type
  description: string;
  children?: Component[]
  // Some props examples are Input components that can have a type prop which is the input type that will be rendered (password, email, etc)
  props?: {style: {[key: string]: any}; [key: string]: any; } // props are a key-value pair that will be used to config a given Component
  columns: number; // the number of columns this row occupies where 12 means 100%
}

type Container = BaseComponent & { name: 'Container'; props: { style: { flexDirection: 'row' | 'column'; justifyContent: 'start' | 'center' | 'end'; alignItems: 'start' | 'center' | 'end'; flex: string; [key: string]: any}; [key: string]: any; } }

type Button = BaseComponent & { name: 'Button'; props: { value: string; [key: string]: string; } } // the button text;
type Link = BaseComponent & { name: 'Link'; props: { value: string; [key: string]: string; } } // the link text;
type Input = BaseComponent & { name: 'Input'; props: { label: string; placeholder: string; [key: string]: string; } }
type Select = BaseComponent & { name: 'Select'; props: { label: string; placeholder: string; [key: string]: string; } }
type Checkbox = BaseComponent & { name: 'Checkbox'; }
type RadioItem = BaseComponent & { name: 'RadioItem'; props: { value: string; label: string; [key: string]: string; }; }
type RadioGroup = BaseComponent & { name: 'RadioGroup'; props: { label: string; [key: string]: string; }; children: RadioItem[]; }
type Form = BaseComponent & { name: 'Form'; children: Input | DateInput | Text | Button | Select | Switch | Checkbox | RadioGroup | Rating | Toggle | Textarea; }
type Switch = BaseComponent & { name: 'Switch'; }
type DateInput = BaseComponent & { name: 'DateInput'; }
type Textarea = BaseComponent & { name: 'Textarea'; props: { placeholder: string; [key: string]: string; } }
type ButtonIcon = BaseComponent & { name: 'ButtonIcon'; }
type Rating = BaseComponent & { name: 'Rating'; }
type FileButton = BaseComponent & { name: 'FileButton'; }
type FileUpload = BaseComponent & { name: 'FileUpload'; }

type Title = BaseComponent & { name: 'Title'; props: { order: 1 | 2 | 3 | 4 | 5 | 6; value: string; [key: string]: string; } }
type Text = BaseComponent & { name: 'Text'; props: { value: string; [key: string]: string; } }

type Table = BaseComponent & { name: 'Table'; props: { data: { [key: string]: string }[]; } }
type Icon = BaseComponent & { name: 'Icon'; }
type Image = BaseComponent & { name: 'Image'; }
type Divider = BaseComponent & { name: 'Divider'; props: { label: string; labelPosition: 'center'; [key: string]: string; } }
type Avatar = BaseComponent & { name: 'Avatar'; }
type Accordion = BaseComponent & { name: 'Accordion'; }

type Breadcrumb = BaseComponent & { name: 'Breadcrumb'; children: Link[]; }
type Tabs = BaseComponent & { name: 'Tabs'; }

type Alert = BaseComponent & { name: 'Alert'; }
type Badge = BaseComponent & { name: 'Badge'; }

type ChartProps = { series: { name: string; data: number[]; }[]; options: { title: { text: string; }; }; }
type XAxisProps = { xaxis: { categories: string[]; }; }
type PieChart = { name: 'PieChart'; props: { series: number[]; options: { labels: string[]; }; }; }
type RadarChart = { name: 'RadarChart'; props: ChartProps & XAxisProps; }
type BarChart = { name: 'BarChart'; props: ChartProps & XAxisProps; }
type LineChart = { name: 'LineChart'; props: ChartProps & XAxisProps; }
type AreaChart = { name: 'AreaChart'; props: ChartProps & XAxisProps; }

type Modal = BaseComponent & { name: 'Modal'; }
type Drawer = BaseComponent & { name: 'Drawer'; }
type PopOver = BaseComponent & { name: 'PopOver'; }

type Component = 
  | Container
  | Button
  | Link
  | Input
  | Select
  | Checkbox
  | RadioGroup
  | Form
  | Switch
  | DateInput
  | Textarea
  | ButtonIcon
  | Rating
  | FileButton
  | FileUpload
  | Title
  | Text
  | Table
  | Icon
  | Image
  | Divider
  | Avatar
  | Accordion
  | Breadcrumb
  | Tabs
  | Alert
  | Badge
  | PieChart
  | RadarChart
  | BarChart
  | LineChart
  | AreaChart
  | Modal
  | Drawer
  | PopOver;

Return an array of Rows like:

type Row = {
  components: Component[] // Every component you include renders a Container with flex-direction row automatically on the WACBG
}

type Page = {
  rows: Row[];
};

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

export const getFunctionalityPrompt = ({
  description,
  responseType,
}: PromptParams) => `

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
  responseType = "JSON",
}: PromptParams) => `

You are a Layout & Styling Component Generator System (LSCGS) that returns structured ${responseType} consistent with the given TypeScript GridContainer type definition.
Your task is to analyze the provided screenshot and generate its layout, components and their styling in the correct location you seem them.

While examining the screenshot, adhere to these specific requirements:

Detailed Grid Structure: 
- Emphasize the need for a detailed examination of the grid structure in the screenshot, including the number of rows and columns, their 
respective sizes, and the placement of content within the grid cells.

Visual Hierarchy: 
- Point out that the visual hierarchy observed in the screenshot should be maintained in the ${responseType} structure, with clear indications of the 
relationships between different components.

Styling Precision: 
- You must be precise with your styling attributes to be extracted from the screenshot and reflected in the ${responseType}.

Component Mapping: 
- Specify that the elements in the screenshot should be mapped to corresponding Mantine UI components, ensuring that the ${responseType} output is ready for 
use with Mantine UI v6.

Iconography: 
- If icons are present, ensure that the appropriate Tabler icons are identified and included in the ${responseType}.

Charts:
- If charts are present, ensure that the appropriate chart type is identified and included in the ${responseType}.

Specific Requirements:
- ${description ?? "Copy the screenshot to your best ability"}

type GridContainer = {
  gridTemplateColumns:  "{number} / span {number}";
  type: "CARD" | "INVISIBLE_CONTAINER";
  containers: Container[];
}

type Container = {
  gap: string;
  gridTemplateColumns: string;
  components: Component[];
};

type BaseComponent = {
  name: string; // Only include names from the Component type
  description: string;
  children?: Component[];
  gridColumn: string;
  props?: {style: {[key: string]: any}; [key: string]: any; };
}

type Button = BaseComponent & { name: 'Button'; props: { value: string; icon?: Icon; [key: string]: string; } }
type Link = BaseComponent & { name: 'Link'; props: { value: string; [key: string]: string; } } 
type Input = BaseComponent & { name: 'Input'; props: { label: string; placeholder: string; [key: string]: string; } }
type Select = BaseComponent & { name: 'Select'; props: { label: string; placeholder: string; [key: string]: string; } }
type Checkbox = BaseComponent & { name: 'Checkbox'; }
type RadioItem = BaseComponent & { name: 'RadioItem'; props: { value: string; label: string; [key: string]: string; }; }
type RadioGroup = BaseComponent & { name: 'RadioGroup'; props: { label: string; [key: string]: string; }; children: RadioItem[]; }
type Form = BaseComponent & { name: 'Form'; children: Input | DateInput | Text | Button | Select | Switch | Checkbox | RadioGroup | Rating | Toggle | Textarea; }
type Switch = BaseComponent & { name: 'Switch'; }
type DateInput = BaseComponent & { name: 'DateInput'; }
type Textarea = BaseComponent & { name: 'Textarea'; props: { placeholder: string; [key: string]: string; } }
type ActionIcon = BaseComponent & { name: 'ActionIcon'; }
type Rating = BaseComponent & { name: 'Rating'; }
type FileButton = BaseComponent & { name: 'FileButton'; }
type FileUpload = BaseComponent & { name: 'FileUpload'; }

type Title = BaseComponent & { name: 'Title'; props: { order: 1 | 2 | 3 | 4 | 5 | 6; value: string; [key: string]: string; } }
type Text = BaseComponent & { name: 'Text'; props: { value: string; [key: string]: string; } }

type Table = BaseComponent & { name: 'Table'; props: { data: { [key: string]: string }[]; } }
type Icon = BaseComponent & { name: 'Icon'; props: { name: string; } } // Use icons from https://tabler-icons-react.vercel.app/ for example IconTrendingUp
type Image = BaseComponent & { name: 'Image'; }
type Divider = BaseComponent & { name: 'Divider'; props: { label: string; labelPosition: 'center'; [key: string]: string; } }
type Avatar = BaseComponent & { name: 'Avatar'; }
type Accordion = BaseComponent & { name: 'Accordion'; }

type Breadcrumb = BaseComponent & { name: 'Breadcrumb'; children: Link[]; }
type Tabs = BaseComponent & { name: 'Tabs'; }

type Alert = BaseComponent & { name: 'Alert'; }
type Badge = BaseComponent & { name: 'Badge'; }

type ChartProps = { series: { name: string; data: number[]; }[]; options: { title: { text: string; }; }; }
type XAxisProps = { xaxis: { categories: string[]; }; }
type PieChart = { name: 'PieChart'; props: { series: number[]; options: { labels: string[]; }; }; }
type RadarChart = { name: 'RadarChart'; props: ChartProps & XAxisProps; }
type BarChart = { name: 'BarChart'; props: ChartProps & XAxisProps; }
type LineChart = { name: 'LineChart'; props: ChartProps & XAxisProps; }
type AreaChart = { name: 'AreaChart'; props: ChartProps & XAxisProps; }
type RadialChart = { name: 'RadialChart'; props: ChartProps & XAxisProps; }

type Component = 
  | Button
  | Link
  | Input
  | Select
  | Checkbox
  | RadioGroup
  | Form
  | Switch
  | DateInput
  | Textarea
  | ActionIcon
  | Rating
  | FileButton
  | FileUpload
  | Title
  | Text
  | Table
  | Icon
  | Image
  | Divider
  | Avatar
  | Accordion
  | Breadcrumb
  | Tabs
  | Alert
  | Badge
  | PieChart
  | RadarChart
  | BarChart
  | LineChart
  | AreaChart;

  ${
    responseType === "JSON" || responseType === "TOML"
      ? `Remember LSCGS, you must return in ${responseType} format only as I will parse the response using ${responseType}.parse(<RESPONSE>).
  There is no need to include the starting ${responseType} quotes.
  Do not explain the response, it has to be ${responseType} only.`
      : ""
  }
`;
