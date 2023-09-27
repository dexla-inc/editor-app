import { Skeleton, SkeletonProps } from "@mantine/core";

export const PieChart = (props: SkeletonProps) => (
  <Skeleton circle {...props} />
);

export const Chart = ({ width, height, ...props }: SkeletonProps) => {
  const { variant, radius, ...rest } = props;
  return (
    <Skeleton
      height={height}
      width={width}
      radius={radius}
      variant={variant}
      {...rest}
    />
  );
};
