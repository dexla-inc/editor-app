import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment } from "react";

export const withComponentWrapper = <T extends {}>(
  Component: ComponentType<T>,
) => {
  const Config = (props: any) => {
    const hasTooltip = !!props.component?.props?.tooltip;
    const isLoading = props.component?.props?.loading;
    const Wrapper = hasTooltip ? Tooltip : isLoading ? Skeleton : Fragment;

    return (
      // @ts-ignore
      <Wrapper
        {...(hasTooltip
          ? {
              label: props.component?.props?.tooltip,
              color: props.component?.props?.tooltipColor,
              withArrow: true,
            }
          : isLoading
          ? { visible: true }
          : {})}
      >
        <Component {...props} />
      </Wrapper>
    );
  };

  return Config;
};
