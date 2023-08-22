import { Button, Group, TextInput } from "@mantine/core";
import { Icon } from "@/components/Icon";
import { useState } from "react";

export const SelectOptionsForm = ({
  getValue,
  setFieldValue,
}: {
  getValue: any;
  setFieldValue: any;
}) => {
  const [label, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <>
      <Group style={{ flexWrap: "nowrap" }}>
        <TextInput
          size="xs"
          label="Options"
          placeholder="label"
          value={label}
          onChange={(event) => setKey(event.target.value)}
          style={{
            width: "50%",
          }}
        />

        <TextInput
          size="xs"
          label=" "
          placeholder="value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{
            width: "50%",
          }}
        />
      </Group>

      <Button
        size="xs"
        type="button"
        onClick={() => {
          setFieldValue("data", getValue().concat({ label, value }));
          setKey("");
          setValue("");
        }}
        variant="outline"
        color="blue"
      >
        Add option
      </Button>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* @ts-ignore*/}
        {getValue().map(({ label, value }, index) => {
          return (
            <Group key={index} style={{ flexWrap: "nowrap" }}>
              <TextInput
                size="xs"
                placeholder="label"
                value={label}
                onChange={(event) => {
                  const nPrev = [...getValue()];
                  nPrev[index].label = event.target.value;
                  setFieldValue("data", nPrev);
                }}
                style={{ width: "50%" }}
              />
              <TextInput
                size="xs"
                placeholder="value"
                value={value}
                onChange={(event) => {
                  const nPrev = [...getValue()];
                  nPrev[index].value = event.target.value;
                  setFieldValue("data", nPrev);
                }}
                style={{ width: "50%" }}
              />

              <Icon
                name="IconTrash"
                onClick={() => {
                  const nPrev = getValue().filter(
                    (_: any, i: number) => index !== i
                  );

                  setFieldValue("data", nPrev);
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
