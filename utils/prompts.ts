type PromptParams = {
  pageName?: string;
  pageDescription?: string;
  appDescription?: string;
  appIndustry?: string;
  entities?: string;
};

export const getPageGenerationPrompt = ({
  pageName,
  pageDescription,
  appDescription,
  appIndustry,
  entities,
}: PromptParams) => `
  You are a Page Generator System (PGS). Given a list of entities, the page description, app description and app industry respond with the structure of the Page.
  The page structure of the response must match the Page Typescript type:

  type Button = {
    name: "button";
    data: { label: string };
  };

  type Checkbox = { name: "checkbox"; data: { label: string } };

  type Radio = { name: "radio"; data: { label: string } };

  type Select = {
    name: "select";
    data: { label: string; placeholder: string };
  };

  type Input = {
    name: "input";
    data: { label: string; placeholder: string };
  };

  type Textarea = {
    name: "textarea";
    data: { label: string; placeholder: string };
  };

  type DateInput = {
    name: "dateInput";
    data: { label: string; placeholder: string };
  };

  type StatTile = {
    name: "stat"
    entityName: string
    data: {
      title: string
      description: string
      value: number
    }
  }

  // for cases where we need to list people
  // like a list of users, or a list of employees, for example
  // in those cases we would have a list of PersonTile
  type PersonTile = {
    name: "person"
    data: {
      avatar: string
      name: string
      subtitle: string
    }
  }

  type LineChartTile = {
    name: "lineChart"
    data: {
      series: { name: string; data: number[] }[]
      xaxis: { categories: string[] }
    }
  }

  // all tables will be searchable by default 
  // so no need to include a search form
  type TableTile = {
    name: "table"
    data: {
      title: string
      // data is required, as we will later use the keys as columns as values in the rows
      data: { [key: string]: string }[]
    }
  }

  type FormTile = {
    name: "form"
    fields: (
      | Input
      | DateInput
      | Button
      | Select
      | Checkbox
      | Radio
      | Textarea
    )[]
    data: {
      title: string
    }
  }

  type Tile = StatTile | PersonTile | LineChartTile | TableTile | FormTile

  type DashboardTemplate = {
    name: "dashboard"
    tiles: (
      | StatTile
      | PersonTile
      | LineChartTile
      | TableTile
    )[]
  }

  type SignupTemplate = {
    name: "signup"
    tiles: [FormTile]
  }

  type SigninTemplate = {
    name: "signin"
    tiles: [FormTile]
  }

  type CRUDTemplate = {
    name: "crud"
    tiles: (
      | TableTile
      | FormTile
    )[]
  }

  type Template = DashboardTemplate | SignupTemplate | SigninTemplate | CRUDTemplate

  type Page = {
    template: Template
  }

  Use the entity name where you need the entity data, like 'entity.<entity-name>.<entity-data-key>'.
  If you want the amount of items for a given entity, use 'entity.<entity-name>.count'.
  The return must be in JSON format. Make sure it's valid JSON as we will be parsing it using JSON.parse.
    
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
}: PromptParams) => `
  Given an app description, app industry, and the entities that can be used on the app, respond with a page list that would make sense for that app.
  The response must match the Pages Typescript type:

  type Pages = {
    name: string
    // what the page contains
    description: string
  }[]

  Always include a Dashboard page where one can see a overview of the app data for the given entities.
  The return must be in JSON format. Make sure it's valid JSON as we will be parsing it using JSON.parse.

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

  APP DESCRIPTION: ${appDescription}
  APP INDUSTRY: ${appIndustry}
`;
