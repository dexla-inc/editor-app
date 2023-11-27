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
      <tbody {...componentProps} {...props}>
        {data.map((item: any, i: number) => (
          <tr key={i}>
            {Object.keys(item).map((key: any, i: number) => (
              <td key={i}>{item[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(merge(child)))
        : null}
    </>
  );
};

export const TableHeader = memo(TableHeaderComponent, isSame);
