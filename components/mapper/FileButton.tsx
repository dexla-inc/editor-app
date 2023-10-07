import { uploadFile } from "@/requests/storage/mutations";
import { Component } from "@/utils/editor";
import {
  Button,
  FileButtonProps,
  FileButton as MantineFileButton,
} from "@mantine/core";
import { useRouter } from "next/router";

type Props = {
  renderTree: (component: Component) => any;
  component: Component;
} & FileButtonProps;

export const FileButton = ({ renderTree, component, ...props }: Props) => {
  const { name, accept, multiple, ...componentProps } = component.props ?? {};

  const router = useRouter();
  const projectId = router.query.id as string;

  return (
    <>
      <MantineFileButton
        accept={accept as string}
        multiple={multiple as boolean}
        {...componentProps}
        {...props}
        onChange={(e) => uploadFile(projectId, e as File | File[], multiple)}
      >
        {(props) => <Button {...props}>{name}</Button>}
      </MantineFileButton>
    </>
  );
};
