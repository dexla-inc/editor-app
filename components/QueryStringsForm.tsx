import { Button, Group, TextInput } from "@mantine/core";
import { Icon } from "@/components/Icon";
import { Dispatch, SetStateAction, useState } from "react";
import { QueryStringListItem } from "@/requests/pages/types";

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
      <Group style={{ flexWrap: "nowrap" }}>
        <TextInput
          label="Query strings"
          placeholder="key"
          value={queryKey}
          onChange={(event) => setQueryKey(event.target.value)}
          style={{
            width: "50%",
          }}
        />

        <TextInput
          label=" "
          placeholder="value"
          value={queryValue}
          onChange={(event) => setQueryValue(event.target.value)}
          style={{
            width: "50%",
          }}
        />
      </Group>

      <Button
        type="button"
        onClick={() => {
          setQueryStrings((prev: QueryStringListItem[]) => {
            return prev.concat({ key: queryKey, value: queryValue });
          });
          setQueryKey("");
          setQueryValue("");
        }}
        variant="outline"
        color="blue"
      >
        Add query string
      </Button>

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
              />
            </Group>
          );
        })}
      </div>
    </>
  );
};
