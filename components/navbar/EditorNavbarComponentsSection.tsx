import {
  Center,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { structureMapper } from "@/utils/componentMapper";
import { IconSearch } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getComponentList } from "@/requests/projects/queries";
import { useRouter } from "next/router";
import { CustomComponentResponse } from "@/requests/projects/mutations";
import { DraggableComponent } from "@/components/DraggableComponent";
import { decodeSchema } from "@/utils/compression";

type DraggableComponentData = {
  id: string;
  draggable: any;
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

  const components = Object.keys(structureMapper).reduce(
    (draggables, key): DraggableComponentData[] => {
      const draggable = structureMapper[key]?.Draggable;

      return draggable ? draggables.concat({ draggable, id: key }) : draggables;
    },
    [] as DraggableComponentData[]
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
  const sortedComponents = components.sort(sort);

  const customComponents =
    componentList.data?.results.filter((c) => c.scope !== "GLOBAL") ?? [];

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
        <Stack spacing="xs">
          {(query
            ? sortedComponents.filter((sc) =>
                new RegExp(query, "i").test(sc.id)
              )
            : sortedComponents
          ).map(({ id, draggable: Draggable }: DraggableComponentData) => {
            return <Draggable key={id} />;
          })}
        </Stack>
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
          ).map(({ content, type }: CustomComponentResponse) => {
            return (
              <DraggableComponent
                key={type}
                id={type}
                data={JSON.parse(decodeSchema(content))}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};
