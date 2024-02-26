import { useEditorStore } from "@/stores/editor";
import { isSame } from "@/utils/componentComparison";
import { Component, getAllChildrenComponents } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useEffect, useState } from "react";

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

  const setTreeComponentCurrentState = useEditorStore(
    (state) => state.setTreeComponentCurrentState,
  );
  const updateTreeComponentAttrs = useEditorStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const [_checked, setChecked] = useState<boolean>(
    isPreviewMode ? checked : false,
  );

  const updateState = (id: string) => {
    updateTreeComponentAttrs([id], {
      onLoad: {
        currentState: {
          dataType: "static",
          static: checked ? "checked" : "default",
        },
      },
    });
  };

  useEffect(() => {
    updateState(component.id!);
    const allChildren = getAllChildrenComponents(component);
    allChildren.forEach((c) => updateState(c.id!));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, component.id]);

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
