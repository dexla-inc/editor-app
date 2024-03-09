import { useThemeStore } from "@/stores/theme";
import { Loader, LoaderProps } from "@mantine/core";

export const InputLoader = (props: LoaderProps) => {
  const theme = useThemeStore((state) => state.theme);
  return (
    <Loader
      {...props}
      size={props.size ?? "xs"}
      color={theme.colors.Primary[6] ?? "teal"}
    />
  );
};
