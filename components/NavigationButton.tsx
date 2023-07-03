import { ExtractRouteParams, replaceBrackets } from "@/utils/dashboardTypes";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useMemo } from "react";

type BasePathContainsSquareBrackets<T> = keyof T extends never ? true : false;

type NavigationButtonProps<
  TBasePath extends string,
  TReplacements extends ExtractRouteParams<TBasePath>
> = {
  basePath: TBasePath;
  text: string;
  variant?: "filled" | "outline" | "light" | "default" | "subtle";
} & (BasePathContainsSquareBrackets<TReplacements> extends true
  ? { replacements?: never }
  : { replacements: TReplacements });

export const NavigationButton = <
  TBasePath extends string,
  TReplacements extends ExtractRouteParams<TBasePath>
>({
  basePath,
  replacements,
  text,
  variant = "filled",
}: NavigationButtonProps<TBasePath, TReplacements>) => {
  const path = useMemo(() => {
    if (replacements) {
      return replaceBrackets(basePath, replacements);
    } else {
      return basePath;
    }
  }, [basePath, replacements]);

  return (
    <Link href={basePath} as={path}>
      <Button variant={variant} sx={{ width: "100%" }}>
        {text}
      </Button>
    </Link>
  );
};
