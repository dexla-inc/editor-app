import { LocationField } from "@/components/editor/BindingField/handlers/RulesForm/LocationField";
import { useComputeValue } from "@/hooks/data/useComputeValue";
import { useEditorTreeStore } from "@/stores/editorTree";
import { DataType, ValueProps } from "@/types/dataBinding";
import { ICON_SIZE } from "@/utils/config";
import { Component, getComponentTreeById } from "@/utils/editor";
import {
  ActionIcon,
  Group,
  MultiSelect,
  Select,
  SelectItem,
  TextInput,
} from "@mantine/core";
import { IconPlugConnected } from "@tabler/icons-react";

type ValueField = {
  value: ValueProps;
  onChange: (val: ValueProps) => void;
  placeholder: string;
  isMultiple: boolean;
  isSingle: boolean;
  id?: string;
};

function useGetData(id?: string) {
  const treeRoot = useEditorTreeStore((state) => state.tree.root);
  const component = getComponentTreeById(treeRoot, id!);

  const onLoad = useComputeValue({
    onLoad: (component as Component)?.onLoad ?? {},
  });

  const dataHandler: Record<string, any[]> = {
    Select: onLoad.data ?? (component as Component)?.props?.data,
    Radio:
      component?.children?.map((child) => {
        const value =
          (child as Component)?.onLoad?.value ??
          (child as Component)?.props?.value;
        return {
          value,
          label: value,
        };
      }) ?? [],
    default: [],
  };
  const name = component?.name ?? "default";
  const data = useComputeValue({ onLoad: dataHandler[name] }) as SelectItem[];
  return { name, data };
}

export const ValueField = ({
  placeholder,
  isMultiple,
  isSingle,
  onChange,
  value,
  id,
}: ValueField) => {
  const { name, data } = useGetData(id!);

  function renderField(type: "Single" | "Multiple") {
    const componentHandler = {
      Single: () => {
        if (name === "Radio" || name === "Select") {
          return (
            <Select
              withAsterisk
              label="Value"
              placeholder={placeholder}
              data={data}
              value={value?.static}
              onChange={(val) => onChange({ ...value, static: val })}
              style={{ flexGrow: 1 }}
              size="xs"
            />
          );
        }
        return (
          <TextInput
            withAsterisk
            label="Value"
            placeholder={placeholder}
            value={value?.static}
            onChange={(e) => {
              onChange({ ...value, static: e.target.value });
            }}
            style={{ flexGrow: 1 }}
            size="xs"
          />
        );
      },
      Multiple: () => {
        const mergedData = Array.isArray(value?.static)
          ? [...data, ...value?.static]
          : data;
        return (
          <MultiSelect
            label="Value"
            placeholder={placeholder}
            data={mergedData}
            value={Array.isArray(value?.static) ? value?.static : []}
            searchable
            creatable
            withAsterisk
            getCreateLabel={(query) => `+ Create ${query}`}
            onChange={(val) => {
              onChange({ ...value, static: val });
            }}
            onCreate={(query) => {
              const item = { value: query, label: query };
              onChange({
                ...value,
                static: [...(value?.static ?? []), item],
              });
              return item;
            }}
            style={{ flexGrow: 1 }}
            size="xs"
          />
        );
      },
    };
    return componentHandler[type]();
  }

  const isStaticDataType =
    value?.dataType === undefined || value?.dataType === "static";

  return (
    <Group align="flex-start" w="100%" spacing={5}>
      {isStaticDataType && (
        <>
          {isSingle && renderField("Single")}
          {isMultiple && renderField("Multiple")}
        </>
      )}
      {isStaticDataType || (
        <LocationField
          label="Value"
          value={value?.boundCode!}
          onChange={(val) => {
            onChange({ ...value, boundCode: val });
          }}
        />
      )}
      {(isSingle || isMultiple) && (
        <ActionIcon
          onClick={() => {
            const dataType = isStaticDataType
              ? DataType.boundCode
              : DataType.static;
            onChange({ ...value, dataType });
          }}
          variant="default"
          tabIndex={-1}
          mt={25}
        >
          <IconPlugConnected size={ICON_SIZE} />
        </ActionIcon>
      )}
    </Group>
  );
};
