import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGoogleFonts } from "@/utils/googleFonts";
import { Select } from "@mantine/core";
import { INPUT_SIZE } from "@/utils/config";

type SelectFontProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const SelectFont = ({ label, value, onChange }: SelectFontProps) => {
  const [fontSearch, setFontSearch] = useState("");

  const { data: googleFontsData = [] } = useQuery({
    queryKey: ["fonts"],
    queryFn: () => getGoogleFonts(),
  });

  return (
    <Select
      label={label}
      placeholder="Choose font"
      value={value}
      data={googleFontsData
        .map((f: any) => f.family)
        .filter(
          (f: string) => f?.toLowerCase().includes(fontSearch?.toLowerCase()),
        )
        .slice(0, 10)}
      onChange={onChange}
      searchable
      searchValue={fontSearch}
      onSearchChange={setFontSearch}
      size={INPUT_SIZE}
    />
  );
};
