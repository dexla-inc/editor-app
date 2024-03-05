import { useEditorStore } from "@/stores/editor";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Select, SelectProps } from "@mantine/core";

type Props = Omit<SelectProps, "data" | "onChange"> & {
  form: any;
  selectedComponentIds: string[];
};

export const FontSelector = ({
  label = "Type",
  form,
  selectedComponentIds,
  ...restProps
}: Props) => {
  const theme = useEditorStore((state) => state.theme);

  const fonts = theme.fonts.reduce((acc, font) => {
    if (font.type === "TEXT") {
      acc.push({ label: font.tag, value: font.tag, font });
    }
    return acc;
  }, [] as any[]);

  const onChange = (value: string) => {
    form.setFieldValue("fontTag", value as string);
    const selectedFont = fonts.find((font) => font.value === value).font;

    debouncedTreeComponentAttrsUpdate({
      attrs: {
        props: {
          fontTag: value,
          style: {
            fontSize: selectedFont.fontSize,
            fontWeight: selectedFont.fontWeight,
            lineHeight: selectedFont.lineHeight,
          },
        },
      },
    });
  };
  return (
    <Select label={label} data={fonts} {...restProps} onChange={onChange} />
  );
};
