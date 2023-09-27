import { Component } from "@/utils/editor";
import { Flex, Group, Skeleton, SkeletonProps } from "@mantine/core";

export const style = {
  justify: "center",
  align: "center",
  p: "20px",
};

export const MantineSkeleton = (props: SkeletonProps) => {
  return (
    <Flex {...style}>
      <Skeleton {...props} />
    </Flex>
  );
};
