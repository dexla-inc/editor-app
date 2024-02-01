import { ActionIconDefault } from "@/components/ActionIconDefault";
import { ComponentToBindFromInput } from "@/components/ComponentToBindFromInput";
import { Icon } from "@/components/Icon";
import { QueryStringListItem } from "@/requests/pages/types";
import { TemplateTypesOptions } from "@/requests/templates/types";
import { useEditorStore } from "@/stores/editor";
import { usePropelAuthStore } from "@/stores/propelAuth";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { Button, Flex, Group, Select, Text, TextInput } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";

type QueryStringsFormProps = {
  queryStringState: [
    QueryStringListItem[],
    Dispatch<SetStateAction<QueryStringListItem[]>>,
  ];
  readOnlyKeys?: boolean;
};

export const QueryStringsForm = ({
  queryStringState,
  readOnlyKeys = false,
}: QueryStringsFormProps) => {
  const [queryKey, setQueryKey] = useState("");
  const [queryValue, setQueryValue] = useState("");
  const [queryStrings, setQueryStrings] = queryStringState;

  const setComponentToBind = useEditorStore(
    (state) => state.setComponentToBind,
  );
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId,
  );
  const setPickingComponentToBindTo = useEditorStore(
    (state) => state.setPickingComponentToBindTo,
  );

  const company = usePropelAuthStore((state) => state.activeCompany);

  return (
    <>
      <Flex justify="space-between" align="center">
        <Text fz="xs" weight="500">
          Query Strings
        </Text>

        {!readOnlyKeys && (
          <Button
            type="button"
            compact
            onClick={() => {
              setQueryStrings((prev: QueryStringListItem[]) => {
                return prev.concat({ key: queryKey, value: queryValue });
              });
              setQueryKey("");
              setQueryValue("");
            }}
            variant="default"
            sx={{ marginRight: 0 }}
            leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
          >
            Add
          </Button>
        )}
      </Flex>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {queryStrings.map(({ key, value }, index) => {
          return (
            <Group key={index} style={{ flexWrap: "nowrap" }}>
              <TextInput
                disabled={readOnlyKeys}
                placeholder="key"
                value={key}
                onChange={(event) => {
                  setQueryStrings((prev: QueryStringListItem[]) => {
                    const nPrev = [...prev];
                    nPrev[index].key = event.target.value;
                    return nPrev;
                  });
                }}
                size="xs"
                style={{ width: "50%" }}
              />
              {readOnlyKeys ? (
                <></>
              ) : // TODO: uncomment this when we have the ability to bind components
              // <ComponentToBindFromInput
              //   value={value}
              //   placeholder="value"
              //   label=""
              //   componentId={selectedComponentId}
              //   onPickComponent={(componentToBindId: string) => {
              //     setQueryStrings((prev: QueryStringListItem[]) => {
              //       const nPrev = [...prev];
              //       nPrev[index].value = componentToBindId;
              //       return nPrev;
              //     });
              //
              //     setPickingComponentToBindTo(undefined);
              //     setComponentToBind(undefined);
              //   }}
              // />
              company.orgName == "Dexla" && key == "type" ? (
                <Select
                  value={value ?? "REPORT"}
                  onChange={(value) => {
                    setQueryStrings((prev: QueryStringListItem[]) => {
                      const nPrev = [...prev];
                      nPrev[index].value = value as string;
                      return nPrev;
                    });
                  }}
                  data={TemplateTypesOptions}
                  size="xs"
                />
              ) : (
                <TextInput
                  placeholder="value"
                  value={value}
                  onChange={(event) => {
                    setQueryStrings((prev: QueryStringListItem[]) => {
                      const nPrev = [...prev];
                      nPrev[index].value = event.target.value;
                      return nPrev;
                    });
                  }}
                  size="xs"
                  style={{ width: "50%" }}
                />
              )}

              <ActionIconDefault
                iconName={ICON_DELETE}
                tooltip="Delete"
                onClick={() => {
                  setQueryStrings((prev: QueryStringListItem[]) => {
                    return prev.filter((_, i) => index !== i);
                  });
                }}
              />
            </Group>
          );
        })}
      </div>
    </>
  );
};
