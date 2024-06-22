import { ProjectUpdateParams } from "@/requests/projects/types";

export type ProjectApp = {
  id: string;
  type: "rss_feed";
  configuration: ProjectAppType;
};

export type RssFeedData = {
  relativeUrl: string;
  version: string;
  encoding: string;
  endpointId: string;
  resultsKey: string;
  staleTime: number;
  binds: {
    header: Record<string, string>;
    parameter: Record<string, string>;
    body: Record<string, string>;
  };
};

export type ProjectAppType = RssFeedData;

export type ProjectAppForm = Pick<ProjectUpdateParams, "apps">;
