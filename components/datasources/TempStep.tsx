import { Button, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

export default function TempStep() {
  const form = useForm({
    initialValues: {
      searchValue: "",
    },
    validate: {},
  });

  const onSubmit = async (values: any) => {
    console.log("TempStep:" + JSON.stringify(values));
  };

  const [searchValue, onSearchChange] = useState<string | null>(null);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Select
        label="Your favorite framework/library"
        placeholder="Pick one"
        searchable
        nothingFound="No options"
        onSearchChange={onSearchChange}
        searchValue={searchValue ?? ""}
        {...form.getInputProps("searchValue")}
        data={["React", "Angular", "Svelte", "Vue"]}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
