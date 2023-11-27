import { isSame } from "@/utils/componentComparison";
import { Component } from "@/utils/editor";
import cloneDeep from "lodash.clonedeep";
import merge from "lodash.merge";
import { memo } from "react";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
};

export const TableHeaderComponent = ({
  component,
  renderTree,
  ...props
}: Props) => {
  const {
    data: dataProp,
    exampleData,
    ...componentProps
  } = component.props as any;

  const data = cloneDeep(
    dataProp?.value ?? dataProp ?? exampleData.value ?? exampleData,
  );

  return (
    <>
      <thead {...componentProps} {...props}>
        <tr>
          {data.map((item: any, i: number) => (
            <th key={i}>{item}</th>
          ))}
        </tr>
      </thead>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(merge(child)))
        : null}
    </>
  );
};

export const TableHeader = memo(TableHeaderComponent, isSame);
