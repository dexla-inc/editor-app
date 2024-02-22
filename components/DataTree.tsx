import { JSONSelector } from "@/components/JSONSelector";
import { Button, ScrollArea, Stack } from "@mantine/core";
import { useMemo } from "react";

type Props = {
  dataItems: any[];
  onItemSelection: (selected: string) => void;
  type?: "components" | "variables" | "auth" | "browser" | "actions";
  filterKeyword?: string;
};

type DataItemProps = {
  item: any;
  onClick?: any;
} & Pick<Props, "type" | "onItemSelection">;

const filterDataItems = (dataItems: any[], filterKeyword: string) => {
  const regex = new RegExp(filterKeyword, "i");
  return dataItems.filter((variable: any) => {
    return filterKeyword === "" || regex.test(variable.name);
  });
};

const DataItemButton = ({
  item,
  onClick,
}: Pick<DataItemProps, "item" | "onClick">) => (
  <Button onClick={onClick}>{item.name}</Button>
);

const DataItem = ({ onClick, item, onItemSelection, type }: DataItemProps) => {
  if (type === "actions") {
    return (
      <JSONSelector
        name={item.name}
        data={{
          success: item.success,
          error: item.error,
        }}
        onSelectValue={(selected) =>
          onItemSelection(
            `${JSON.stringify({
              id: item?.id,
              path: selected.path,
            })}`,
          )
        }
      />
    );
  }
  if (type === "components")
    return <DataItemButton item={item} onClick={onClick} />;
  if (type === "auth" || type === "browser")
    return (
      <JSONSelector
        name={type}
        data={item}
        onSelectValue={(selected) => onItemSelection(`${selected.path}`)}
      />
    );
  if (type === "variables") {
    const isVariableNotObject = item?.type && item?.type !== "OBJECT";
    return isVariableNotObject ? (
      <DataItemButton item={item} onClick={onClick} />
    ) : (
      <JSONSelector
        name={item.name}
        data={item}
        onSelectValue={(selected) =>
          onItemSelection(
            `${JSON.stringify({
              id: item?.id,
              path: selected.path,
            })}`,
          )
        }
      />
    );
  }
};

export function DataTree({
  dataItems = [],
  onItemSelection,
  type = "variables",
  filterKeyword = "",
}: Props) {
  const filteredDataItems = useMemo(
    () => filterDataItems(dataItems, filterKeyword),
    [dataItems, filterKeyword],
  );

  return (
    <ScrollArea.Autosize mah={150}>
      <Stack align="flex-start" spacing="xs">
        {filteredDataItems.map((dataItem: any, index: number) => (
          <DataItem
            key={dataItem.id ?? index}
            item={dataItem}
            onItemSelection={onItemSelection}
            type={type}
            onClick={() => onItemSelection(`${dataItem.id}`)}
          />
        ))}
      </Stack>
    </ScrollArea.Autosize>
  );
}
