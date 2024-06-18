export type ProjectApp = {
  id: string;
  type: "rss_feed";
  configuration: AppType;
};

export type RssFeedData = {
  endpoint: string;
  relativeUrl: string;
  version: string;
  encoding: string;
};

export type AppType = RssFeedData;
