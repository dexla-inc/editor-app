import { Icon } from "@/components/Icon";
import { QueryStringListItem } from "@/requests/pages/types";
import { ICON_SIZE } from "@/utils/config";
import { Button, Flex, Group, Text, TextInput } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";

export const QueryStringsForm = ({
  queryStringState,
}: {
  queryStringState: [
    QueryStringListItem[],
    Dispatch<SetStateAction<QueryStringListItem[]>>
  ];
}) => {
  const [queryKey, setQueryKey] = useState("");
  const [queryValue, setQueryValue] = useState("");
  const [queryStrings, setQueryStrings] = queryStringState;

  return (
    <>
      <Flex justify="space-between">
        <Text fz="sm" weight="500">
          Query Strings
        </Text>

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
          color="indigo"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </Flex>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {queryStrings.map(({ key, value }, index) => {
          return (
            <Group key={index} style={{ flexWrap: "nowrap" }}>
              <TextInput
                placeholder="key"
                value={key}
                onChange={(event) => {
                  setQueryStrings((prev: QueryStringListItem[]) => {
                    const nPrev = [...prev];
                    nPrev[index].key = event.target.value;
                    return nPrev;
                  });
                }}
                style={{ width: "50%" }}
              />
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
                style={{ width: "50%" }}
              />

              <Icon
                name="IconTrash"
                onClick={() => {
                  setQueryStrings((prev: QueryStringListItem[]) => {
                    return prev.filter((_, i) => index !== i);
                  });
                }}
                style={{ cursor: "pointer" }}
                color="red"
              />
            </Group>
          );
        })}
      </div>
    </>
  );
};
