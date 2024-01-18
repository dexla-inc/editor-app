import { Icon } from "@/components/Icon";
import { TopLabel } from "@/components/TopLabel";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import { Button, Flex, Group, TextInput } from "@mantine/core";
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
      <Flex justify="space-between" gap="xl" sx={{ marginTop: "0.5rem" }}>
        <TopLabel text="Options" />
        <Button
          type="button"
          compact
          onClick={() => {
            setFieldValue("data", getValue()?.concat({ label, value }));
            setKey("");
            setValue("");
          }}
          variant="default"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </Flex>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* @ts-ignore*/}
        {getValue()?.map(({ label, value }, index) => {
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
                name={ICON_DELETE}
                onClick={() => {
                  const nPrev = getValue().filter(
                    (_: any, i: number) => index !== i,
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
