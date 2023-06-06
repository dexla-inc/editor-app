import { Stack, TextInput } from "@mantine/core";
import { structureMapper } from "@/utils/componentMapper";
import { IconSearch } from "@tabler/icons-react";
import { ICON_SIZE } from "@/utils/config";
import { useState } from "react";

type DraggableComponentData = {
  id: string;
  draggable: any;
};

export const EditorNavbarComponentsSection = () => {
  const [query, setQuery] = useState<string>("");

  const components = Object.keys(structureMapper).reduce(
    (draggables, key): DraggableComponentData[] => {
      const draggable = structureMapper[key]?.Draggable;

      return draggable ? draggables.concat({ draggable, id: key }) : draggables;
    },
    [] as DraggableComponentData[]
  );

  const sortedComponents = components.sort((a, b) => {
    const aId = a.id as string;
    const bId = b.id as string;

    if (aId < bId) {
      return -1;
    }
    if (aId > bId) {
      return 1;
    }

    return 0;
  });

  return (
    <Stack>
      <TextInput
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        placeholder="Search"
        icon={<IconSearch size={ICON_SIZE} />}
      />
      {(query
        ? sortedComponents.filter((sc) => new RegExp(query, "i").test(sc.id))
        : sortedComponents
      ).map(({ id, draggable: Draggable }: DraggableComponentData) => {
        return <Draggable key={id} />;
      })}
    </Stack>
  );
};
