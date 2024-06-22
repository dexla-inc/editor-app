import { Stack } from "@mantine/core";
import { AppId, AppItem, AppProp } from "../AppItem";
import { EditorRssFeedSection } from "@/components/navbar/apps/EditorRssFeedSection";
import { useState } from "react";

const apps = [
  {
    id: "rss_feed",
    name: "RSS Feed",
    image: "/rss-feed.svg",
  },
] as AppProp[];

export type Apps = typeof apps;

type AppsMapper = {
  [key in AppId]: any;
};

export const sectionMapper: AppsMapper = {
  rss_feed: (props: any) => <EditorRssFeedSection {...props} />,
};

export const EditorNavbarAppsSection = ({}) => {
  const [selectedApp, setSelectedApp] = useState<AppId | null>(null);

  return (
    <Stack>
      {!selectedApp
        ? apps.map((item) => (
            <AppItem
              key={item.id}
              {...item}
              onClick={() => setSelectedApp(item.id)}
            />
          ))
        : sectionMapper[selectedApp]({ setSelectedApp })}
    </Stack>
  );
};
