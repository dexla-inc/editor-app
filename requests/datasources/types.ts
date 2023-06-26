import { PageParams } from "@/requests/types";

export interface DataSourcesParams extends PageParams {
  type?: string;
}

export interface DataSourceResponse {
  id: string;
  name: string;
  authenticationScheme: string;
  isTested: boolean;
  environment?: ApiEnvironmentDto;
  swaggerUpdated: number;
}

interface ApiEnvironmentDto {
  type?: EnvironmentTypes;
  baseUrl: string;
  swaggerUrl?: string;
}

type EnvironmentTypes = "None" | "Staging" | "Production";
