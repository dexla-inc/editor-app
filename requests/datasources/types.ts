import { IResponse, MethodTypes, PagingParams } from "@/requests/types";
import { ApiType } from "@/types/dashboardTypes";

export type DataSourceTypes =
  | "API"
  | "AIRTABLE"
  | "GRAPH_QL"
  | "SWAGGER"
  | "SUPABASE";

export interface DataSourcesListParams extends PagingParams {
  datasourceId?: string;
  include?: string; // Supported params are: endpoints,auth
  type?: string;
}

export interface DataSourceEndpointsListParams extends PagingParams {
  dataSourceId?: string | undefined;
  authOnly?: boolean;
  methodType?: MethodTypes;
}

export type SwaggerParams = { swaggerUrl: string };

export type DataSourceParams = {
  type: DataSourceTypes;
  name?: string;
  baseUrl?: string;
  authenticationScheme?: AuthenticationSchemes;
  environment?: string;
  swaggerUrl?: string;
  authValue?: string;
  apiKey?: string;
};

export interface DataSourceResponse {
  id: string;
  name: string;
  authenticationScheme: AuthenticationSchemes;
  environment: string; //EnvironmentTypes
  baseUrl: string;
  swaggerUrl: string;
  updated: number;
  type: DataSourceTypes;
  isTested: boolean;
  changedEndpoints?: Endpoint[];
  deletedEndpoints?: Endpoint[];
  authValue?: string;
  apiKey?: string;
  endpoints?: Endpoint[];
  auth?: DataSourceAuthResponse;
}

export interface ErrorResponse extends Error, IResponse {
  message: string;
  errors: ErrorDetail[];
}

type ErrorDetail = {
  field: string;
  message: string;
  code: string;
};

export type EnvironmentTypes = "Editor" | "Staging" | "Production";

export type MediaTypes =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "application/graphql"
  | "text/event-stream"
  | "application/octet-stream"
  | "multipart/form-data";

export type Endpoint = {
  id: string;
  dataSourceId: string;
  baseUrl: string | undefined;
  relativeUrl: string;
  url?: string | null;
  methodType: MethodTypes;
  description: string | null;
  mediaType: MediaTypes;
  headers: Header[];
  parameters: Parameter[];
  requestBody: RequestBody[];
  body?: string;
  exampleResponse: string;
  errorExampleResponse: string;
  authentication: AuthenticationEndpoint;
  withCredentials: boolean | null;
  isServerRequest: boolean;
};

export type EndpointParams = Omit<Endpoint, "id" | "authentication">;

type AuthenticationEndpoint = {
  endpointType: "REFRESH" | "ACCESS" | "USER";
  tokenKey: string;
  tokenSecondaryKey: string;
};

export interface FieldTypeBase {
  name: string;
  type: ParameterTypes | AuthenticationSchemes;
  description: string | null;
  value: any | null;
}

export interface Header extends FieldTypeBase {
  required: boolean;
}

export interface Parameter extends FieldTypeBase {
  location: ParameterLocations;
  required: boolean;
}

export interface RequestBody extends FieldTypeBase {}

export type ExampleResponse = {
  value: any | null;
  children: ExampleResponse[];
  name: string;
  type: string;
  description: string | null;
};

export type ParameterTypes =
  | "string"
  | "number"
  | "boolean"
  | "datetime"
  | "object"
  | "array"
  | "file";
export type ParameterLocations = "Query" | "Path" | "Header" | "Cookie";
export type AuthenticationSchemes = "NONE" | "BEARER" | "BASIC" | "API_KEY";

// Copilot create authentication scheme object for AuthenticationSchemes and friendly labels
export const AuthenticationSchemeLabels: Record<AuthenticationSchemes, string> =
  {
    NONE: "No Authentication",
    BEARER: "Bearer Token",
    BASIC: "Basic Auth",
    API_KEY: "API Key",
  };

export type DataSourceAuthListResponse = {
  authConfigurations: Record<string, Omit<DataSourceAuthResponse, "type">>;
};

export type DataSourceAuthResponse = {
  type: AuthenticationSchemes;
  accessTokenUrl?: string;
  refreshTokenUrl?: string;
  userEndpointUrl?: string;
  accessTokenProperty?: string;
  refreshTokenProperty?: string;
  expiryTokenProperty?: string;
  apiKey?: string;
  dataType?: "SWAGGER" | "API" | "SUPABASE";
};

export type ApiFromAI = Pick<
  DataSourceResponse,
  "name" | "baseUrl" | "authenticationScheme" | "environment"
> & {
  apiDocsUrl?: string;
  apiAuthTokenDocsUrl?: string;
  endpoints: ApiEndpointFromAI[];
};

export type ApiEndpointFromAI = Pick<
  Endpoint,
  | "relativeUrl"
  | "methodType"
  | "mediaType"
  | "headers"
  | "parameters"
  | "requestBody"
  | "body"
  | "exampleResponse"
  | "errorExampleResponse"
  | "withCredentials"
  | "isServerRequest"
> & {
  url?: string | null;
};

type Defaults = {
  header: Header;
  parameter: Parameter;
  body: RequestBody;
};

export const defaultApiRequest: {
  [K in keyof Defaults as ApiType]: Defaults[K];
} = {
  header: {
    required: false,
    name: "",
    type: "string",
    description: null,
    value: null,
  },
  parameter: {
    location: "Query",
    required: false,
    name: "",
    type: "string",
    description: null,
    value: null,
  },
  body: {
    name: "",
    type: "string",
    description: null,
    value: null,
  },
};
