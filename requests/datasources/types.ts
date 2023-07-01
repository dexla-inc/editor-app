import { MethodTypes, PagingParams } from "@/requests/types";

export type DataSourceTypes = "API" | "AIRTABLE" | "GRAPH_QL";

export interface DataSourcesListParams extends PagingParams {
  type?: string;
}

export interface DataSourceEndpointsListParams extends PagingParams {
  authOnly?: boolean;
  methodType?: MethodTypes;
}

export type CreatedResponse = {
  id: string;
  trackingId: string;
};

export type SwaggerParams = { swaggerUrl: string };

export type DataSourceParams = {
  name?: string;
  authenticationScheme?: string;
  environment?: string;
  baseUrl?: string;
  swaggerUrl?: string;
};

export interface DataSourceResponse {
  id: string;
  name: string;
  authenticationScheme: string;
  environment: string;
  baseUrl: string;
  swaggerUrl: string;
  updated: number;
  type: DataSourceTypes;
  isTested: boolean;
  changedEndpoints?: Endpoint[];
  deletedEndpoints?: Endpoint[];
}

export type EnvironmentTypes = "None" | "Staging" | "Production";

export type Endpoint = {
  id: string;
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
  authentication: AuthenticationEndpoint;
};

type AuthenticationEndpoint = {
  endpointType: string;
  tokenKey: string;
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

export type ExampleResponse = {
  value: any | null;
  children: ExampleResponse[];
  name: string;
  type: string;
  description: string | null;
};
