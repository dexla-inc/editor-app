import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { ModalAndDrawerWrapper } from "@/libs/dnd-flex/components/mapper/ModalAndDrawerWrapper";
import { convertSizeToPx } from "@/utils/defaultSizes";
import merge from "lodash.merge";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;

export const ModalComponent = forwardRef(
  (
    { renderTree, component, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    const sizePx = convertSizeToPx(component?.props?.size, "modal");

    return (
      <ModalAndDrawerWrapper component={component}>
        {({
          isPreviewMode,
          target,
          sizeProps,
          componentProps,
          showInEditor,
          handleClose,
          titleStyle,
          isSizeFullScreen,
          title,
        }) => {
          return (
            <MantineModal
              ref={ref}
              centered
              withinPortal
              trapFocus={false}
              lockScroll={false}
              target={target}
              {...sizeProps}
              size={sizePx}
              {...props}
              {...componentProps}
              title={title}
              opened={isPreviewMode ? true : showInEditor}
              onClose={handleClose}
              styles={{
                content: style ?? {},
                body: { height: "fit-content" },
                title: { ...titleStyle },
                ...(isSizeFullScreen && { inner: { left: 0 } }),
              }}
            >
              {component.children?.map((child) =>
                renderTree(child, shareableContent),
              )}
            </MantineModal>
          );
        }}
      </ModalAndDrawerWrapper>
    );
  },
);
ModalComponent.displayName = "Modal";

export const Modal = memo(withComponentWrapper<Props>(ModalComponent));
