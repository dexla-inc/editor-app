import { JSONSelector } from "@/components/JSONSelector";
import { isObjectOrArray, jsonInString, safeJsonParse } from "@/utils/common";
import { Button, Flex, ScrollArea, Stack } from "@mantine/core";
import { useMemo } from "react";
import DataItemValuePreview from "./DataItemValuePreview";
import { ContextType } from "@/types/dataBinding";

type Props = {
  dataItems: any[];
  onItemSelection: (selected: string) => void;
  type?: ContextType;
  filterKeyword?: string;
};

type DataItemProps = {
  item: any;
  onClick?: any;
} & Pick<Props, "type" | "onItemSelection">;

const filterDataItems = (
  dataItems: any[],
  filterKeyword: string,
  type: string,
) => {
  const regex = new RegExp(filterKeyword, "i");

  const filterObject = (obj: any): any => {
    if (typeof obj !== "object" || obj === null) return obj;
    let filtered: any = {};
    for (const key in obj) {
      if (regex.test(key)) {
        filtered[key] = obj[key];
      } else if (typeof obj[key] === "object") {
        const nestedFiltered = filterObject(obj[key]);
        if (Object.keys(nestedFiltered).length > 0) {
          filtered[key] = nestedFiltered;
        }
      }
    }
    return filtered;
  };

  return dataItems.filter((variable: any) => {
    if (filterKeyword === "") {
      return true;
    }

    let nameMatches = regex.test(variable.name);
    let valueMatches = false;
    let filteredValue: any = null;

    try {
      const parsedValue = JSON.parse(variable.value ?? variable.defaultValue);
      if (typeof parsedValue === "object" && parsedValue !== null) {
        filteredValue = filterObject(parsedValue);
        valueMatches = Object.keys(filteredValue).length > 0;
      }
    } catch (e) {
      // Handle the case where parsing fails (e.g., invalid JSON)
    }

    if (nameMatches || valueMatches) {
      if (valueMatches) {
        variable.value = JSON.stringify(filteredValue);
        if (!variable.value) {
          variable.defaultValue = JSON.stringify(filteredValue);
        }
      }
      return true;
    }

    return false;
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
  if (type === "components") {
    if (isObjectOrArray(item.value)) {
      return (
        <JSONSelector
          type="components"
          name={item.description}
          data={item.value}
          onSelectValue={(selected) => {
            onItemSelection(
              `${JSON.stringify({
                id: item?.id,
                path: selected.path,
              })}`,
            );
          }}
        />
      );
    }

    return <DataItemButton item={item} onClick={onClick} />;
  }
  if (["event", "item", "others"].includes(type!)) {
    return (
      <JSONSelector
        name={type!}
        data={item}
        onSelectValue={(selected) => onItemSelection(`${selected.path}`)}
      />
    );
  }
  if (type === "variables") {
    const isVariableNotObject =
      item?.type && item?.type !== "OBJECT" && item?.type !== "ARRAY";

    return isVariableNotObject ? (
      <Flex gap="xs">
        <DataItemButton item={item} onClick={onClick} />
        {item.value && <DataItemValuePreview value={item.value} />}
      </Flex>
    ) : (
      <JSONSelector
        name={item.name}
        data={prepareVariableItem(item.value)}
        onSelectValue={(selected) =>
          onItemSelection(
            `${JSON.stringify({
              id: item?.id,
              path: selected.path,
            })}`,
          )
        }
        type="variables"
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
    () => filterDataItems(dataItems, filterKeyword, type),
    [dataItems, filterKeyword],
  );

  return (
    <ScrollArea.Autosize mah={200}>
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

function prepareVariableItem(value: any) {
  return {
    value: jsonInString(value) ? safeJsonParse(value) : value,
  };
}
