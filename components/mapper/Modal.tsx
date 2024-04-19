import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { ModalAndDrawerWrapper } from "@/components/mapper/ModalAndDrawerWrapper";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;

export const ModalComponent = forwardRef(
  (
    { renderTree, component, style, shareableContent, ...props }: Props,
    ref,
  ) => {
    return (
      <ModalAndDrawerWrapper component={component}>
        {({
          isLive,
          target,
          sizeProps,
          componentProps,
          showInEditor,
          handleClose,
          titleStyle,
          isSizeFullScreen,
          isVisible,
        }) => {
          console.log(
            "ModalComponent",
            component?.description,
            isVisible,
            isLive,
            showInEditor,
          );
          return (
            <MantineModal
              ref={ref}
              centered
              withinPortal
              trapFocus={false}
              lockScroll={false}
              target={target}
              {...sizeProps}
              {...props}
              {...componentProps}
              opened={isLive ? isVisible : showInEditor}
              onClose={handleClose}
              styles={{
                content: style ?? {},
                body: { height: "fit-content" },
                title: { ...titleStyle },
                ...(isSizeFullScreen && { inner: { left: 0 } }),
              }}
            >
              {component.children?.map((child) => renderTree(child))}
            </MantineModal>
          );
        }}
      </ModalAndDrawerWrapper>
    );
  },
);
ModalComponent.displayName = "Modal";

export const Modal = memo(withComponentWrapper<Props>(ModalComponent));
