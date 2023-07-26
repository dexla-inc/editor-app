import { Component } from "@/utils/editor";
import { Modal as MantineModal, ModalProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & ModalProps;

export const Modal = ({
  renderTree,
  component,
  opened: propOpened,
  onClose: propOnClose,
  ...props
}: Props) => {
  const { children, title, ...componentProps } = component.props as any;

  const [opened, { open, close }] = useDisclosure(propOpened);

  const modalRef = { open, close };

  const handleClose = () => {
    close();
    propOnClose && propOnClose();
  };

  return (
    <MantineModal
      opened={opened}
      onClose={handleClose}
      title={title}
      {...props}
      {...componentProps}
    >
      {component.children && component.children.length > 0
        ? component.children?.map((child) => renderTree(child))
        : children}
    </MantineModal>
  );
};
