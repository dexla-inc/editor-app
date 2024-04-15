import { EditableComponentMapper } from "@/utils/editor";
import { Radio as MantineRadio, RadioProps } from "@mantine/core";
import { memo, useState } from "react";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useShallow } from "zustand/react/shallow";

type Props = EditableComponentMapper & RadioProps;

const RadioItemComponent = ({
  renderTree,
  component,
  shareableContent,
  ...props
}: Props) => {
  const isPreviewMode = useEditorTreeStore(
    useShallow((state) => state.isPreviewMode || state.isLive),
  );
  const {
    value: defaultValue,
    children,
    ...componentProps
  } = component.props as any;
  const { value } = component.onLoad ?? {};

  const { value: parentValue, isInsideGroup = false } = shareableContent;
  const checked = parentValue === value;

  const [_checked, setChecked] = useState<boolean>(checked);

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
      wrapperProps={{ "data-id": component.id }}
      label={
        component.children && component.children.length > 0
          ? component.children?.map((child) =>
              renderTree(child, {
                ...(checked && {
                  parentState: "checked",
                }),
              }),
            )
          : children
      }
      value={value}
      checked={_checked}
      styles={{
        inner: { display: "none" },
        label: {
          padding: 0,
        },
      }}
    />
  );
};

export const RadioItem = memo(RadioItemComponent);
