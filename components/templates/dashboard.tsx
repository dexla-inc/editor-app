import { defaultBorderValues } from "@/components/modifiers/Border";
import { tileMapper } from "@/components/templates/tiles";
import {
  getDataSourceEndpoints,
  getDataSources,
} from "@/requests/datasources/queries-noauth";
import { createLogicFlow } from "@/requests/logicflows/mutations";
import { createVariable } from "@/requests/variables/mutations";
import { structureMapper } from "@/utils/componentMapper";
import { encodeSchema } from "@/utils/compression";
import { px } from "@mantine/core";
import { nanoid } from "nanoid";

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

export type StatTile = {
  name: "stat";
  entityName: string;
  data: {
    title: string;
    description: string;
    value: number;
  };
};

// for cases where we need to list people
// like a list of users, or a list of employees, for example
// in those cases we would have a list of PersonTile
export type PersonTile = {
  name: "person";
  entityName: string;
  data: {
    avatar: string;
    name: string;
    subtitle: string;
  };
};

type LineChartTile = {
  name: "lineChart";
  data: {
    series: { name: string; data: number[] }[];
    xaxis: { categories: string[] };
  };
};

// all tables will be searchable by default
// so no need to include a search form
type TableTile = {
  name: "table";
  data: {
    title: string;
    // data is required, as we will later use the keys as columns as values in the rows
    data: { [key: string]: string }[];
  };
};

type FormTile = {
  name: "form";
  fields: (Input | DateInput | Button | Select | Checkbox | Radio | Textarea)[];
  data: {
    title: string;
  };
};

export type Tile = StatTile | PersonTile | LineChartTile | TableTile | FormTile;

type DashboardTemplate = {
  name: "dashboard";
  tiles: (StatTile | PersonTile | LineChartTile | TableTile)[];
};

type SignupTemplate = {
  name: "signup";
  tiles: [FormTile];
};

type SigninTemplate = {
  name: "signin";
  tiles: [FormTile];
};

type CRUDTemplate = {
  name: "crud";
  tiles: (TableTile | FormTile)[];
};

type Template =
  | DashboardTemplate
  | SignupTemplate
  | SigninTemplate
  | CRUDTemplate;

export type Page = {
  template: Template;
};

export type TemplateAiResponse = {
  name: string;
};

export type Data = {
  tiles: Tile[];
};

// TODO: This needs completely reviewing such as direct API calls.
export const template = async (
  data: Data,
  theme: any,
  pages: any,
  projectId: string,
  pageId: string,
) => {
  const projectResponse = await fetch(`/api/project/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const projectData = await projectResponse.json();

  const stats = data.tiles
    .filter((tile: Tile) => tile.name === "stat")
    .map((tile: Tile) => {
      // @ts-ignore
      const tileContent = tileMapper[tile.name](tile);
      return tileContent;
    });

  const people = data.tiles
    .filter((tile: Tile) => tile.name === "person")
    // @ts-ignore
    .map((tile: PersonTile) => {
      // @ts-ignore
      const tileContent = tileMapper[tile.name](tile);
      return { tileContent, entityName: tile.entityName };
    });

  const groupedPeople = data.tiles
    .filter((tile: Tile) => tile.name === "person")
    // @ts-ignore
    .reduce((acc: { [key: string]: PersonTile[] }, curr: PersonTile) => {
      if (!acc.hasOwnProperty(curr.entityName)) {
        acc = {
          ...acc,
          [curr.entityName]: [],
        };
      }
      acc[curr.entityName].push(curr);
      return acc;
    }, {});

  const navBar = structureMapper["Navbar"].structure({
    theme,
    pages,
  });

  const hasStats = stats.length > 0;
  const hasPeople = people.length > 0;

  const datasources = await getDataSources(projectId, {});
  const dsId = datasources.results.find((ds) => ds.name === "Example API")?.id;
  const endpoints = await getDataSourceEndpoints(projectId, {
    dataSourceId: dsId,
  });
  const endpoint = endpoints.results.find(
    (e) => e.description === "Get Entity Data" && e.relativeUrl === "Project",
  );

  let statsData = undefined;
  if (hasStats) {
    const logicFlow = await createLogicFlow(projectId, {
      name: "Get Stats",
      data: encodeSchema(
        JSON.stringify({
          nodes: [
            {
              id: "k0LWIUG0iBxBZxk2p8h0f",
              type: "actionNode",
              position: {
                x: 170.5,
                y: 73.75,
              },
              data: {
                label: "Action",
                description: "Execute an action",
                inputs: [
                  {
                    id: "GpM6Ygq_77Saq1ZtZn9d8",
                    name: "Input",
                  },
                ],
                outputs: [
                  {
                    id: "rdpQCe1kfTsrYbwdFNtC7",
                    name: "Output",
                  },
                ],
                form: {
                  action: "apiCall",
                  endpoint: endpoint?.id,
                  showLoader: true,
                  "binds.parameter.id": "eq.263f4aa3ce574cf3a8996f8f28c3b24a",
                  "binds.parameter.select": "data",
                  "binds.header.apikey":
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc25kdXZleGV6ZW5rc3Fwdm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc3NzM3NjksImV4cCI6MjAxMzM0OTc2OX0.BtdpJTGNBGIEM84dwXL_4khMNA0EjBeXeg2RbrmtOLA",
                },
              },
              selected: true,
              dragging: false,
            },
            {
              id: "start-node",
              type: "startNode",
              data: {
                label: "Start",
                description: "The starting point of a flow",
                inputs: [],
                outputs: [
                  {
                    id: "SMAtDW56EE8uxf5FzwfsY",
                    name: "Initial Trigger",
                  },
                ],
              },
              position: {
                x: 0,
                y: 0,
              },
            },
          ],
          edges: [
            {
              source: "start-node",
              sourceHandle: "SMAtDW56EE8uxf5FzwfsY",
              target: "k0LWIUG0iBxBZxk2p8h0f",
              targetHandle: "GpM6Ygq_77Saq1ZtZn9d8",
              type: "smoothstep",
              id: "reactflow__edge-start-nodeSMAtDW56EE8uxf5FzwfsY-k0LWIUG0iBxBZxk2p8h0fGpM6Ygq_77Saq1ZtZn9d8",
            },
          ],
        }),
      ),
      pageId: pageId,
      isGlobal: false,
    });

    statsData = {
      id: nanoid(),
      name: "Container",
      description: "Stats Container",
      props: {
        style: {
          display: "flex",
          flexDirection: "row",
          rowGap: "20px",
          columnGap: "20px",
          alignItems: "stretch",
          justifyContent: "flex-start",
          position: "relative",
          borderTopStyle: "none",
          borderRightStyle: "none",
          borderBottomStyle: "none",
          borderLeftStyle: "none",
          borderTopWidth: "0px",
          borderRightWidth: "0px",
          borderBottomWidth: "0px",
          borderLeftWidth: "0px",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          padding: "0px",
          width: "auto",
          height: "auto",
          minHeight: "10px",
          flexWrap: "wrap",
        },
      },
      children: stats,
    };
  }

  let peopleData: any[] = [];
  if (hasPeople) {
    await Promise.all(
      Object.keys(groupedPeople).map(async (key) => {
        // @ts-ignore
        const _people = people
          .filter((p) => p.entityName === key)
          .map((p) => p.tileContent);

        const ex = JSON.stringify(projectData.data[key], null, 2);

        const _var = await createVariable(projectId, {
          name: `GET ${key} Data`,
          type: "OBJECT",
          defaultValue: ex,
          isGlobal: false,
        });

        const logicFlow = await createLogicFlow(projectId, {
          name: `Get ${key} People`,
          data: encodeSchema(
            JSON.stringify({
              nodes: [
                {
                  id: "k0LWIUG0iBxBZxk2p8h0f",
                  type: "actionNode",
                  position: {
                    x: 170.5,
                    y: 73.75,
                  },
                  data: {
                    label: "Action",
                    description: "Execute an action",
                    inputs: [
                      {
                        id: "GpM6Ygq_77Saq1ZtZn9d8",
                        name: "Input",
                      },
                    ],
                    outputs: [
                      {
                        id: "rdpQCe1kfTsrYbwdFNtC7",
                        name: "Output",
                      },
                    ],
                    form: {
                      action: "apiCall",
                      endpoint: endpoint?.id,
                      showLoader: true,
                      "binds.parameter.id":
                        "eq.263f4aa3ce574cf3a8996f8f28c3b24a",
                      "binds.parameter.select": "data",
                      "binds.header.apikey":
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpc25kdXZleGV6ZW5rc3Fwdm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc3NzM3NjksImV4cCI6MjAxMzM0OTc2OX0.BtdpJTGNBGIEM84dwXL_4khMNA0EjBeXeg2RbrmtOLA",
                    },
                  },
                  selected: false,
                  dragging: false,
                },
                {
                  id: "start-node",
                  type: "startNode",
                  data: {
                    label: "Start",
                    description: "The starting point of a flow",
                    inputs: [],
                    outputs: [
                      {
                        id: "SMAtDW56EE8uxf5FzwfsY",
                        name: "Initial Trigger",
                      },
                    ],
                  },
                  position: {
                    x: 0,
                    y: 0,
                  },
                },
              ],
              edges: [
                {
                  source: "start-node",
                  sourceHandle: "SMAtDW56EE8uxf5FzwfsY",
                  target: "k0LWIUG0iBxBZxk2p8h0f",
                  targetHandle: "GpM6Ygq_77Saq1ZtZn9d8",
                  type: "smoothstep",
                  id: "reactflow__edge-start-nodeSMAtDW56EE8uxf5FzwfsY-k0LWIUG0iBxBZxk2p8h0fGpM6Ygq_77Saq1ZtZn9d8",
                },
              ],
            }),
          ),
          pageId: pageId,
          isGlobal: false,
        });

        peopleData.push({
          id: nanoid(),
          name: "Container",
          description: "People Container",
          props: {
            style: {
              display: "flex",
              flexDirection: "row",
              rowGap: "20px",
              columnGap: "20px",
              alignItems: "stretch",
              justifyContent: "flex-start",
              position: "relative",
              borderTopStyle: "none",
              borderRightStyle: "none",
              borderBottomStyle: "none",
              borderLeftStyle: "none",
              borderTopWidth: "0px",
              borderRightWidth: "0px",
              borderBottomWidth: "0px",
              borderLeftWidth: "0px",
              borderTopLeftRadius: "0px",
              borderTopRightRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
              padding: "0px",
              width: "auto",
              height: "auto",
              minHeight: "10px",
              flexWrap: "wrap",
            },
          },
          children: _people,
        });
      }),
    );
  }

  return {
    root: {
      id: "root",
      name: "Container",
      description: "Root Container",
      props: { style: { width: "100%" } },
      children: [
        navBar,
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
              minHeight: "20px",
            },
          },
          children: [
            {
              id: nanoid(),
              name: "AppBar",
              description: "AppBar",
              fixedPosition: { position: "top", target: "content-wrapper" },
              props: {
                style: {
                  ...defaultBorderValues,
                  borderBottomWidth: `1px`,
                  borderBottomStyle: `solid`,
                  borderBottomColor: theme.colors.Border
                    ? "Border.6"
                    : "gray.3",
                  padding: px(theme.spacing.lg),
                  height: "auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: theme.spacing.md,
                },
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
            },
            {
              id: nanoid(),
              name: "Container",
              description: "Container",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "row",
                  rowGap: "40px",
                  columnGap: "4%",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  position: "relative",
                  borderTopStyle: "none",
                  borderRightStyle: "none",
                  borderBottomStyle: "none",
                  borderLeftStyle: "none",
                  borderTopWidth: "0px",
                  borderRightWidth: "0px",
                  borderBottomWidth: "0px",
                  borderLeftWidth: "0px",
                  borderTopColor: "Border.6",
                  borderRightColor: "Border.6",
                  borderBottomColor: "Border.6",
                  borderLeftColor: "Border.6",
                  borderTopLeftRadius: "0px",
                  borderTopRightRadius: "0px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  padding: "20px",
                  width: "100%",
                  height: "auto",
                  minHeight: "10px",
                  flexWrap: "wrap",
                },
              },
              children: [statsData, ...peopleData].filter(Boolean),
            },
          ],
        },
      ],
    },
  };
};
