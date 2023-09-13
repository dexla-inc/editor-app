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

export type SuccessResponse = Omit<CreatedResponse, "id">;

export type SwaggerParams = { swaggerUrl: string };

export type DataSourceParams = {
  name?: string;
  authenticationScheme?: AuthenticationSchemes;
  environment?: string;
  baseUrl?: string;
  swaggerUrl?: string;
  authValue?: string;
};

export interface DataSourceResponse {
  id: string;
  name: string;
  authenticationScheme: AuthenticationSchemes;
  environment: string;
  baseUrl: string;
  swaggerUrl: string;
  updated: number;
  type: DataSourceTypes;
  isTested: boolean;
  changedEndpoints?: Endpoint[];
  deletedEndpoints?: Endpoint[];
  authValue?: string;
}

export interface ErrorResponse extends Error {
  message: string;
  trackingId: string;
  errors: ErrorDetail[];
}

type ErrorDetail = {
  field: string;
  message: string;
  code: string;
};

export type EnvironmentTypes = "None" | "Staging" | "Production";

export type MediaTypes =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "application/graphql"
  | "text/event-stream"
  | "application/octet-stream";

export type Endpoint = {
  id: string;
  relativeUrl: string;
  methodType: MethodTypes;
  description: string | null;
  mediaType: MediaTypes;
  withCredentials: boolean | null;
  authenticationScheme: AuthenticationSchemes;
  headers: Header[];
  parameters: Parameter[];
  requestBody: RequestBody[];
  exampleResponse: string;
  errorExampleResponse: string;
  authentication: AuthenticationEndpoint;
};

export type EndpointParams = Omit<Endpoint, "id" | "authentication">;

type AuthenticationEndpoint = {
  endpointType: string;
  tokenKey: string;
  tokenSecondaryKey: string;
};

export type ParameterTypes = "string" | "number" | "boolean" | "datetime";

export type Header = {
  required: boolean;
  value: string | null;
  name: string;
  type: ParameterTypes;
  description: string | null;
};

export type ParameterLocations = "Query" | "Path" | "Header" | "Cookie";

export type Parameter = {
  location: ParameterLocations;
  required: boolean;
  name: string;
  type: ParameterTypes;
  description: string | null;
};

export type RequestBody = {
  value: any | null;
  name: string;
  type: ParameterTypes;
  description: string | null;
};

export type ExampleResponse = {
  value: any | null;
  children: ExampleResponse[];
  name: string;
  type: string;
  description: string | null;
};

export type AuthenticationSchemes = "NONE" | "BEARER" | "BASIC" | "API_KEY";

// Copilot create authentication scheme object for AuthenticationSchemes and friendly labels
export const AuthenticationSchemeLabels: Record<AuthenticationSchemes, string> =
  {
    NONE: "No Authentication",
    BEARER: "Bearer Token",
    BASIC: "Basic Auth",
    API_KEY: "API Key",
  };

export type DataSourceAuthResponse = {
  type: AuthenticationSchemes;
  accessTokenUrl?: string;
  refreshTokenUrl?: string;
  userEndpointUrl?: string;
  accessTokenProperty?: string;
  refreshTokenProperty?: string;
  expiryTokenProperty?: string;
};
