import { useThemeStore } from "@/stores/theme";
import { debouncedTreeComponentAttrsUpdate } from "@/utils/editor";
import { Select, SelectProps } from "@mantine/core";

type Props = Omit<SelectProps, "data" | "onChange"> & {
  form: any;
};

export const FontSelector = ({ label = "Type", form, ...restProps }: Props) => {
  const theme = useThemeStore((state) => state.theme);

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
