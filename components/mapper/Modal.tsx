import { withComponentWrapper } from "@/hoc/withComponentWrapper";
import { EditableComponentMapper } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { forwardRef, memo } from "react";
import { ModalAndDrawerWrapper } from "@/components/mapper/ModalAndDrawerWrapper";
import { convertSizeToPx } from "@/utils/defaultSizes";
import { TOTAL_COLUMNS_WITH_MULTIPLIER } from "@/libs/dnd-grid/types/constants";
import { useDndGridStore } from "@/libs/dnd-grid/stores/dndGridStore";

type Props = EditableComponentMapper & Omit<ModalProps, "opened">;

export const ModalComponent = forwardRef(
  (
    {
      renderTree,
      component,
      style,
      shareableContent,
      grid: { ChildrenWrapper },
      ...props
    }: Props,
    ref,
  ) => {
    const sizePx = convertSizeToPx(component?.props?.size, "modal");
    const isInteracting = useDndGridStore((state) => state.isInteracting);

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
          const { triggers, ...restComponentProps } = componentProps;

          return (
            <MantineModal
              ref={ref}
              centered
              withinPortal
              portalProps={{ ["data-id"]: props.id }}
              trapFocus={false}
              lockScroll={false}
              target={target}
              {...sizeProps}
              size={sizePx}
              {...props}
              {...triggers}
              {...restComponentProps}
              title={title}
              opened={isPreviewMode ? true : showInEditor}
              onClose={handleClose}
              styles={{
                content: {
                  ...(style ?? {}),
                  minHeight: "90%",
                  display: "flex",
                  flexDirection: "column",
                },
                body: {
                  display: "grid",
                  gridTemplateColumns: "repeat(120, 1fr)",
                  gridAutoRows: "10px",
                  height: "90%",
                  flex: 1,
                  padding: 0,
                  position: "relative",
                  ...(isInteracting && {
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      height: "100%",
                      zIndex: 100,
                      backgroundSize: `calc(100% / ${TOTAL_COLUMNS_WITH_MULTIPLIER}) 10px`,
                      backgroundImage: `
                          linear-gradient(to right, rgba(60, 60, 60, 0.9) 0.75px, transparent 0.5px),
                          linear-gradient(to bottom, rgba(10, 60, 60, 0.9) 0.75px, transparent 0.5px)
                        `,
                    },
                  }),
                },
                title: { ...titleStyle },
                overlay: { zIndex: 1200 },
                inner: { zIndex: 1300 },
                // ...(isSizeFullScreen && { inner: { left: 0 } }),
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
