import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { useEditorTreeStore } from "@/stores/editorTree";
import { EditableComponentMapper } from "@/utils/editor";
import {
  Pagination as MantinePagination,
  PaginationProps,
} from "@mantine/core";
import { forwardRef, memo } from "react";

type Props = EditableComponentMapper & PaginationProps;

const PaginationComponent = forwardRef(
  ({ component, shareableContent, ...props }: Props, ref) => {
    const { triggers, ...componentProps } = component.props as any;

    const { onChange, ...allTriggers } = triggers || {};

    const customOnChange = (value: any) => {
      const updateTreeComponentAttrs =
        useEditorTreeStore.getState().updateTreeComponentAttrs;
      updateTreeComponentAttrs({
        componentIds: [component.id!],
        attrs: { props: { value } },
      });
      onChange && onChange(value);
    };

    return (
      <MantinePagination
        ref={ref}
        {...props}
        {...componentProps}
        {...allTriggers}
        onChange={customOnChange}
      />
    );
  },
);
PaginationComponent.displayName = "Pagination";

export const Pagination = memo(
  withComponentWrapper<Props>(PaginationComponent),
);
