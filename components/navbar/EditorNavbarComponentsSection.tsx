import { DraggableComponent } from "@/components/DraggableComponent";
import { GenerateComponentsAIButton } from "@/components/GenerateComponentsAIButton";
import { useUserTheme } from "@/hooks/useUserTheme";
import { getComponentList } from "@/requests/components/queries";
import { CustomComponentResponse } from "@/requests/components/types";
import { usePropelAuthStore } from "@/stores/propelAuth";
import {
  ComponentCategoryType,
  componentMapper,
  structureMapper,
} from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { toSpaced } from "@/utils/dashboardTypes";
import {
  Center,
  Grid,
  HoverCard,
  MantineProvider,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconFrustum, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import createCache from "@emotion/cache";
import { Component } from "@/utils/editor";

type DraggableComponentData = {
  id: string;
  draggable: any;
  category?: ComponentCategoryType;
};

export const EditorNavbarComponentsSection = () => {
  const [query, setQuery] = useState<string>("");
  const [componentTypeToShow, setComponentTypeToShow] =
    useState<string>("default");
  const router = useRouter();
  const activeCompany = usePropelAuthStore((state) => state.activeCompany);
  const customStackRef = useRef<HTMLDivElement>(null);
  const userTheme = useUserTheme(router.query.id! as string);

  const componentList = useQuery({
    queryKey: ["components"],
    queryFn: () =>
      getComponentList(router.query.id as string, activeCompany.orgId),
    enabled: !!router.query.id && componentTypeToShow === "custom",
  });

  const componentsGroupedByCategory = Object.keys(structureMapper).reduce(
    (groups, key) => {
      const draggable = structureMapper[key]?.Draggable;
      const category = structureMapper[key]?.category;

      if (draggable) {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push({ draggable, id: toSpaced(key) });
      }

      return groups;
    },
    {} as Record<string, DraggableComponentData[]>,
  );

  const customComponents =
    componentList.data?.results.filter((c) => c.scope !== "GLOBAL") ?? [];

  const renderTree = useCallback((component: Component) => {
    const componentToRender = componentMapper[component.name];

    return componentToRender?.Component({ component, renderTree });
  }, []);

  return (
    <Stack spacing="xl">
      <SegmentedControl
        value={componentTypeToShow}
        onChange={setComponentTypeToShow}
        size="xs"
        data={[
          {
            label: "Default",
            value: "default",
          },
          {
            label: "Custom",
            value: "custom",
          },
        ]}
      />
      <GenerateComponentsAIButton />
      <TextInput
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search"
        size="xs"
        icon={<IconSearch size={ICON_SIZE} />}
      />
      {componentTypeToShow === "default" && (
        <Grid gutter="xs">
          {Object.entries(componentsGroupedByCategory).map(
            ([category, components]) => {
              // Filter the components based on the query before rendering
              const filteredComponents = components.filter(({ id }) =>
                query ? id.toLowerCase().includes(query.toLowerCase()) : true,
              );

              if (filteredComponents.length === 0) {
                return null; // If no components after filtering, don't render this category
              }

              return (
                <>
                  <Grid.Col span={12}>
                    <Title order={6}>{category}</Title>
                  </Grid.Col>
                  {filteredComponents.map(({ id, draggable: Draggable }) => (
                    <Grid.Col span={6} key={id}>
                      <Draggable />
                    </Grid.Col>
                  ))}
                </>
              );
            },
          )}
        </Grid>
      )}

      {componentTypeToShow === "custom" && (
        <Stack spacing="xs" ref={customStackRef}>
          {customComponents?.length === 0 && (
            <Center>
              <Text align="center" size="xs" color="dimmed">
                Create a custom component by editing and saving one on the
                canvas
              </Text>
            </Center>
          )}
          <MantineProvider
            withNormalizeCSS
            theme={userTheme}
            emotionCache={createCache({
              container: customStackRef.current ?? undefined,
              key: "custom-components",
            })}
          >
            <Grid gutter="xs">
              {(query
                ? customComponents.filter((cc) =>
                    new RegExp(query, "i").test(cc.description),
                  )
                : customComponents
              ).map(
                ({
                  id,
                  content,
                  description,
                  type,
                }: CustomComponentResponse) => {
                  const componentData = JSON.parse(decodeSchema(content));

                  return (
                    <HoverCard
                      key={id}
                      width="auto"
                      shadow="md"
                      withinPortal
                      position="right"
                    >
                      <HoverCard.Target>
                        <Grid.Col span={6}>
                          <DraggableComponent
                            icon={<IconFrustum size={LARGE_ICON_SIZE} />}
                            id={id}
                            text={description}
                            data={componentData}
                          />
                        </Grid.Col>
                      </HoverCard.Target>
                      <HoverCard.Dropdown sx={{ pointerEvents: "none" }}>
                        {renderTree(componentData)}
                      </HoverCard.Dropdown>
                    </HoverCard>
                  );
                },
              )}
            </Grid>
          </MantineProvider>
        </Stack>
      )}
    </Stack>
  );
};
