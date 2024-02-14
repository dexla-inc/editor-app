import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment } from "react";

export const withComponentWrapper = <T extends {}>(
  Component: ComponentType<T>,
) => {
  const Config = (props: any) => {
    const hasTooltip = !!props.component?.props?.tooltip;
    const initiallyLoading = props.component?.props?.initiallyLoading;
    const Wrapper = hasTooltip
      ? Tooltip
      : initiallyLoading
      ? Skeleton
      : Fragment;

    return (
      // @ts-ignore
      <Wrapper
        {...(hasTooltip
          ? {
              label: props.component?.props?.tooltip,
              color: props.component?.props?.tooltipColor,
              position: props.component?.props?.tooltipPosition,
              withArrow: true,
            }
          : initiallyLoading
          ? { visible: true }
          : {})}
      >
        <Component {...props} />
      </Wrapper>
    );
  };

  return Config;
};
