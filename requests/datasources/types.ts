import { PageParams } from "@/requests/types";

export type DataSourceTypes = "API" | "AIRTABLE" | "GRAPH_QL";

export interface DataSourcesListParams extends PageParams {
  type?: string;
}

export type CreatedResponse = {
  id: string;
  trackingId: string;
};

export type SwaggerDataSourceParams = DataSourceParams & { swaggerUrl: string };

export type DataSourceParams = {
  name?: string;
  authenticationScheme?: string;
  environment?: string;
  baseUrl?: string;
};

export interface DataSourceResponse {
  id: string;
  name: string;
  authenticationScheme: string;
  isTested: boolean;
  environment: Environment;
  updated: number;
  type: DataSourceTypes;
  changedEndpoints?: Endpoint[];
  deletedEndpoints?: Endpoint[];
}

export type EnvironmentTypes = "None" | "Staging" | "Production";

export type Endpoint = {
  relativeUrl: string;
  methodType: string;
  description: string | null;
  mediaType: string;
  withCredentials: boolean | null;
  authenticationScheme: string;
  headers: Header[];
  parameters: Parameter[];
  requestBody: RequestBody[];
  exampleResponse: ExampleResponse[];
};

type Header = {
  required: boolean;
  value: string | null;
  name: string;
  type: string;
  description: string | null;
};

type Parameter = {
  location: string;
  required: boolean;
  name: string;
  type: string;
  description: string | null;
};

type RequestBody = {
  value: any | null;
  name: string;
  type: string;
  description: string | null;
};

type ExampleResponse = {
  value: any | null;
  children: ExampleResponse[];
  name: string;
  type: string;
  description: string | null;
};

type Environment = {
  type: string;
  baseUrl: string;
  swaggerUrl: string;
};
