import { isSame } from "@/utils/componentComparison";
import { Component, getAllChildrenComponents } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editor";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
  isPreviewMode: boolean;
} & RadioProps;

const RadioItemComponent = ({
  renderTree,
  component,
  isPreviewMode,
  ...props
}: Props) => {
  const {
    value,
    triggers,
    checked,
    isInsideGroup = false,
    children,
    ...componentProps
  } = component.props as any;

  const { setTreeComponentCurrentState } = useEditorStore((state) => state);
  const [_checked, setChecked] = useState<boolean>(
    isPreviewMode ? checked : false,
  );

  useEffect(() => {
    setTreeComponentCurrentState(
      component.id!,
      checked ? "checked" : "default",
    );
    const allChildren = getAllChildrenComponents(component);
    allChildren.forEach((c) =>
      setTreeComponentCurrentState(c.id!, checked ? "checked" : "default"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTreeComponentCurrentState, checked, component.id]);

  const defaultTriggers = isPreviewMode
    ? isInsideGroup
      ? {}
      : {
          onChange: (e: any) => {
            setChecked(e.currentTarget.checked);
          },
        }
    : {
        onChange: (e: any) => {
          e?.preventDefault();
          e?.stopPropagation();
          setChecked(false);
        },
      };

  return (
    <MantineRadio
      {...props}
      {...componentProps}
      {...defaultTriggers}
      label={
        component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree({
                ...child,
                props: {
                  ...child.props,
                },
              }),
            )
          : children
      }
      value={value}
      checked={isPreviewMode ? _checked : false}
      {...triggers}
      styles={{
        inner: { display: "none" },
        label: {
          padding: 0,
        },
      }}
    />
  );
};

export const RadioItem = memo(RadioItemComponent, isSame);
