import { Button, Group, TextInput } from "@mantine/core";
import { Icon } from "@/components/Icon";
import { useState } from "react";

export const QueryStringsForm = ({
  queryStringState,
}: {
  queryStringState: any;
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
          setQueryStrings((prev: any) =>
            prev.concat({ key: queryKey, value: queryValue })
          );
          setQueryKey("");
          setQueryValue("");
        }}
        variant="outline"
        color="blue"
      >
        Add query string
      </Button>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {queryStrings.map(
          ({ key, value }: { key: string; value: string }, index: number) => {
            return (
              <Group key={index} style={{ flexWrap: "nowrap" }}>
                <TextInput
                  placeholder="key"
                  value={key}
                  onChange={(event) => {
                    setQueryStrings((prev: any) => {
                      const nPrev = [...prev];
                      (nPrev[index] as any).key = event.target.value;
                      return nPrev;
                    });
                  }}
                  style={{ width: "50%" }}
                />
                <TextInput
                  placeholder="value"
                  value={value}
                  onChange={(event) => {
                    setQueryStrings((prev: any) => {
                      const nPrev = [...prev];
                      (nPrev[index] as any).value = event.target.value;
                      return nPrev;
                    });
                  }}
                  style={{ width: "50%" }}
                />

                <Icon
                  name="IconTrash"
                  onClick={() => {
                    setQueryStrings((prev: any) => {
                      return prev.filter((_: any, i: number) => index !== i);
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Group>
            );
          }
        )}
      </div>
    </>
  );
};
