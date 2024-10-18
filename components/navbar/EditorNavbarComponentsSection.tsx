import { DraggableComponent as DraggableComponentGrid } from "@/libs/dnd-grid/components/DraggableComponent";
import { DraggableComponent as DraggableComponentFlex } from "@/libs/dnd-flex/components/DraggableComponent";
import GridItemComponent from "@/components/navbar/ComponentGridItem";
import { useCustomComponentList } from "@/hooks/editor/reactQuery/useCustomComponentList";
import {
  ComponentCategoryType,
  componentMapper,
  structureMapper,
} from "@/utils/componentMapper";
import { CustomComponentResponse } from "@/requests/components/types";
import { useEditorTreeStore } from "@/stores/editorTree";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { useThemeStore } from "@/stores/theme";
import { toSpaced } from "@/types/dashboardTypes";
import { safeJsonParse } from "@/utils/common";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { Component } from "@/utils/editor";
import createCache from "@emotion/cache";
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
import { useCallback, useRef, useState } from "react";

type DraggableComponentData = {
  id: string;
  draggable: any;
  category?: ComponentCategoryType;
  hide?: boolean;
  synonyms?: string[];
};

const componentsGroupedByCategory = Object.keys(
  structureMapper("componentsGroupedByCategory"),
).reduce(
  (groups, key) => {
    const draggable = structureMapper()[key]?.Draggable;
    const category = structureMapper()[key]?.category;
    const hide = structureMapper()[key]?.hide ?? false;
    const synonyms = structureMapper()[key]?.synonyms ?? [];

    if (draggable) {
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push({ draggable, id: toSpaced(key), hide, synonyms });
    }

    return groups;
  },
  {} as Record<string, DraggableComponentData[]>,
);

export const EditorNavbarComponentsSection = () => {
  const [query, setQuery] = useState<string>("");
  const [componentTypeToShow, setComponentTypeToShow] =
    useState<string>("default");
  const projectId = useEditorTreeStore(
    (state) => state.currentProjectId,
  ) as string;
  const activeCompany = usePropelAuthStore((state) => state.activeCompany);
  const customStackRef = useRef<HTMLDivElement>(null);
  const userTheme = useThemeStore((state) => state.theme);
  const cssType = useEditorTreeStore((state) => state.cssType);

  const { data: componentList } = useCustomComponentList(
    projectId,
    activeCompany.orgId ?? "",
    componentTypeToShow,
  );

  const renderTree = useCallback((component: Component) => {
    const componentToRender = componentMapper[component.name];

    return componentToRender?.Component({ component, renderTree });
  }, []);

  const DraggableComponent =
    cssType === "GRID" ? DraggableComponentGrid : DraggableComponentFlex;

  return (
    <Stack spacing="xl" p="xs" pr={0}>
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
              const filteredComponents = filterComponents(components, query);

              if (filteredComponents.length === 0) {
                return null; // If no components after filtering, don't render this category
              }

              return (
                <>
                  <Grid.Col span={12}>
                    <Title order={6}>{category}</Title>
                  </Grid.Col>
                  {filteredComponents.map(({ id, draggable: Draggable }) => (
                    <GridItemComponent key={id} id={id} Draggable={Draggable} />
                  ))}
                </>
              );
            },
          )}
        </Grid>
      )}

      {componentTypeToShow === "custom" && (
        <Stack spacing="xs" ref={customStackRef}>
          {componentList?.results?.length === 0 && (
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
                ? componentList &&
                  componentList.results.filter((cc) =>
                    new RegExp(query, "i").test(cc.description),
                  )
                : componentList?.results
              )?.map(
                ({ id, content, description }: CustomComponentResponse) => {
                  const componentData = safeJsonParse(decodeSchema(content));

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

const filterComponents = (
  components: DraggableComponentData[],
  query: string,
) => {
  const lowerCaseQuery = query.toLowerCase();
  const sortedComponents = sortComponents(components);
  return sortedComponents.filter(
    ({ id, synonyms = [], hide }) =>
      (query
        ? id.toLowerCase().includes(lowerCaseQuery) ||
          synonyms.some((synonym) =>
            synonym.toLowerCase().includes(lowerCaseQuery),
          )
        : true) && !hide,
  );
};

const sortComponents = (components: DraggableComponentData[]) => {
  return components.sort((a, b) => a.id.localeCompare(b.id));
};
