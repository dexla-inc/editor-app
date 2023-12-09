import { DraggableComponent } from "@/components/DraggableComponent";
import { GenerateComponentsAIButton } from "@/components/GenerateComponentsAIButton";
import { CustomComponentResponse } from "@/requests/components/mutations";
import { getComponentList } from "@/requests/components/queries";
import { usePropelAuthStore } from "@/stores/propelAuth";
import {
  ComponentCategoryType,
  structureMapper,
} from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE, LARGE_ICON_SIZE } from "@/utils/config";
import { toSpaced } from "@/utils/dashboardTypes";
import {
  Center,
  Grid,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconFrustum, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";

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
                query ? new RegExp(query, "i").test(id) : true,
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
        <Stack spacing="xs">
          {customComponents?.length === 0 && (
            <Center>
              <Text align="center" size="xs" color="dimmed">
                Create a custom component by editing and saving one on the
                canvas
              </Text>
            </Center>
          )}
          <Grid gutter="xs">
            {(query
              ? customComponents.filter((cc) =>
                  new RegExp(query, "i").test(cc.description),
                )
              : customComponents
            ).map(
              ({ id, content, description, type }: CustomComponentResponse) => {
                return (
                  <Grid.Col span={6} key={id}>
                    <DraggableComponent
                      icon={<IconFrustum size={LARGE_ICON_SIZE} />}
                      id={id}
                      text={description}
                      data={JSON.parse(decodeSchema(content))}
                    />
                  </Grid.Col>
                );
              },
            )}
          </Grid>
        </Stack>
      )}
    </Stack>
  );
};
