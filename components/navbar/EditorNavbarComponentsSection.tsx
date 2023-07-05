import { DraggableComponent } from "@/components/DraggableComponent";
import { CustomComponentResponse } from "@/requests/projects/mutations";
import { getComponentList } from "@/requests/projects/queries";
import {
  ComponentCategoryType,
  structureMapper,
} from "@/utils/componentMapper";
import { decodeSchema } from "@/utils/compression";
import { ICON_SIZE } from "@/utils/config";
import {
  Center,
  Grid,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
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

  const componentList = useQuery({
    queryKey: ["components"],
    queryFn: () => getComponentList(router.query.id as string),
    enabled: !!router.query.id,
  });

  const componentsGroupedByCategory = Object.keys(structureMapper).reduce(
    (groups, key) => {
      const draggable = structureMapper[key]?.Draggable;
      const category = structureMapper[key]?.category;

      if (draggable) {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push({ draggable, id: key });
      }

      return groups;
    },
    {} as Record<string, DraggableComponentData[]>
  );

  const sort = (a: DraggableComponentData, b: DraggableComponentData) => {
    const aId = a.id as string;
    const bId = b.id as string;

    if (aId < bId) {
      return -1;
    }
    if (aId > bId) {
      return 1;
    }

    return 0;
  };

  const customComponents =
    componentList.data?.results.filter((c) => c.scope !== "GLOBAL") ?? [];

  const globalComponents = (
    componentList.data?.results.filter((c) => c.scope === "GLOBAL") ?? []
  ).reduce((draggables, component): DraggableComponentData[] => {
    const draggable = (props: any) => (
      <DraggableComponent
        key={component.id}
        id={component.id}
        text={component.description}
        data={JSON.parse(decodeSchema(component.content))}
        {...props}
      />
    );

    return draggables.concat({ draggable, id: component.description });
  }, [] as DraggableComponentData[]);

  const sortedComponents = [...globalComponents].sort(sort);

  return (
    <Stack spacing="xl">
      <SegmentedControl
        value={componentTypeToShow}
        onChange={setComponentTypeToShow}
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
        icon={<IconSearch size={ICON_SIZE} />}
      />
      {componentTypeToShow === "default" && (
        <Grid gutter="xs">
          {Object.entries(componentsGroupedByCategory).map(
            ([category, components]) => (
              <>
                <Grid.Col span={12}>
                  <Title order={6}>{category}</Title>
                </Grid.Col>
                {components
                  .filter(({ id }) =>
                    query ? new RegExp(query, "i").test(id) : true
                  )
                  .map(({ id, draggable: Draggable }) => (
                    <Grid.Col span={6} key={id}>
                      <Draggable />
                    </Grid.Col>
                  ))}
              </>
            )
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
          {(query
            ? customComponents.filter((sc) =>
                new RegExp(query, "i").test(sc.id)
              )
            : customComponents
          ).map(
            ({ id, content, description, type }: CustomComponentResponse) => {
              return (
                <DraggableComponent
                  key={type}
                  id={id}
                  text={description}
                  data={JSON.parse(decodeSchema(content))}
                />
              );
            }
          )}
        </Stack>
      )}
    </Stack>
  );
};
