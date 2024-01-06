import { Component, debouncedTreeUpdate } from "@/utils/editor";
import { Box, SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import { SelectOptionsForm } from "@/components/SelectOptionsForm";
import { useForm } from "@mantine/form";

type Props = {
  component: Component;
};

type Tab = "static" | "dynamic";

export const SelectData = ({ component }: Props) => {
  const form = useForm({
    initialValues: {
      data: component.props?.data ?? [],
    },
  });

  const [tab, setTab] = useState<Tab>("static");

  const setFieldValue = (key: any, value: any) => {
    form.setFieldValue(key, value);
    debouncedTreeUpdate(component.id, { [key]: value });
    console.log("setFieldValue", key, value);
  };

  return (
    <Box>
      <Stack spacing="xs">
        <SegmentedControl
          w="100%"
          size="xs"
          data={[
            { label: "Static", value: "static" },
            { label: "Dynamic", value: "dynamic" },
          ]}
          onChange={(value) => {
            setTab(value as Tab);
          }}
        />
        <form>
          <Stack spacing="xs">
            {tab === "static" && (
              <SelectOptionsForm
                getValue={() => form.getInputProps("data").value}
                setFieldValue={setFieldValue}
              />
            )}
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};
