import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGoogleFonts } from "@/utils/getGoogleFonts";
import { Select } from "@mantine/core";
import { INPUT_SIZE } from "@/utils/config";

type SelectFontProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const SelectFont = ({ label, value, onChange }: SelectFontProps) => {
  const [fontSearch, setFontSearch] = useState("");

  const { data: googleFontsData, isFetched = [] } = useQuery({
    queryKey: ["fonts"],
    queryFn: () => getGoogleFonts(),
  });

  const fontOptions = useMemo(
    () =>
      googleFontsData?.map((font: any) => ({
        value: font.family,
        label: font.family,
        weights: font.weights,
      })),
    [isFetched],
  );

  return (
    <Select
      label={label}
      placeholder="Choose font"
      value={value}
      data={
        fontOptions?.filter((font: any) =>
          font.label.toLowerCase().includes(fontSearch.toLowerCase()),
        ) || []
      }
      onChange={onChange}
      searchable
      searchValue={fontSearch}
      onSearchChange={setFontSearch}
      size={INPUT_SIZE}
    />
  );
};
