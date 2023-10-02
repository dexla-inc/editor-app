import { Node } from "reactflow";
import get from "lodash.get";

export type ComputeParams = {
  sourceNode: Partial<Node>;
  targetNode: Partial<Node>;
  outputs: any[];
  targetKey?: string;
  isDone?: boolean;
};

export const replaceBetweenCurlyBraces = (
  inputString: string,
  replaceFn: (match: string) => string,
): string => {
  const regex = /{{([^}]+)}}/g; // matches text between {{ and }}
  return inputString?.replace(regex, (_, group) => replaceFn(group));
};

export const computeNode = (params: ComputeParams) => {
  const targetKey = params.targetKey ?? "value";
  const targetValue = params.targetNode.data[targetKey];

  const sourceOutputs = params.outputs.filter(
    (o) => o.targetId == params.sourceNode.id,
  );

  const targetOutputs = params.outputs.filter(
    (o) => o.targetId == params.targetNode.id,
  );

  const sourceOutput =
    sourceOutputs.length > 0 ? sourceOutputs[sourceOutputs.length - 1] : null;
  const targetOutput =
    targetOutputs.length > 0 ? targetOutputs[targetOutputs.length - 1] : null;

  const valueToFormat = sourceOutput?.value ?? params.sourceNode.data.value;
  const formatedData = {
    data: {
      ...params.sourceNode.data,
      ...sourceOutput,
      value: valueToFormat,
    },
  };

  const value = targetOutput?.[targetKey] ?? targetValue;

  if (!valueToFormat || !value) {
    return targetValue;
  }

  const result = replaceBetweenCurlyBraces(value, (txt) => {
    if (txt && txt.includes(`${params.sourceNode.id}_`)) {
      return (
        get(formatedData, txt.replace(`${params.sourceNode.id}_`, "")) ?? txt
      );
    }

    return `{{${txt}}}`;
  });

  return result;
};
