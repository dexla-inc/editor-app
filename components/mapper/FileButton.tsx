import { uploadFile } from "@/requests/storage/mutations";
import { Component } from "@/utils/editor";
import {
  FileButton as MantineFileButton,
  FileButtonProps,
  Button,
} from "@mantine/core";
import { useRouter } from "next/router";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FileButtonProps;

export const FileButton = ({ renderTree, component, ...props }: Props) => {
  const { name, accept, triggers, ...componentProps } = component.props ?? {};

  const router = useRouter();
  const projectId = router.query.id as string;

  return (
    <>
      <MantineFileButton
        accept={accept}
        {...componentProps}
        {...props}
        // {...triggers}
        onChange={(e) => uploadFile(projectId, e as File)}
      >
        {(props) => <Button {...props}>{name}</Button>}
      </MantineFileButton>
    </>
  );
};
