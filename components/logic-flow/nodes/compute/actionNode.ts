import { computeNode, ComputeParams } from "@/utils/computeNode";

export const compute = async (params: ComputeParams) => {
  const value = computeNode(params);

  return Promise.resolve({ value });
};
