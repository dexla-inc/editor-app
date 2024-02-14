import { Skeleton, Tooltip } from "@mantine/core";
import { ComponentType, Fragment, useEffect, useState } from "react";

export const withComponentWrapper = <T extends {}>(
  Component: ComponentType<T>,
) => {
  const Config = (props: any) => {
    const hasTooltip = !!props.component?.props?.tooltip;
    const [initiallyLoading, setInitiallyLoading] = useState(true);
    const Wrapper = hasTooltip
      ? Tooltip
      : initiallyLoading
      ? Skeleton
      : Fragment;

    useEffect(() => {
      setInitiallyLoading(false);
    }, []);

    return (
      // @ts-ignore
      <Wrapper
        {...(hasTooltip
          ? {
              label: props.component?.props?.tooltip,
              color: props.component?.props?.tooltipColor,
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
