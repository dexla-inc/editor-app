import { ActionFormProps, CustomJavascriptAction } from "@/utils/actions";
import { Button, Stack } from "@mantine/core";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useState } from "react";
import { MonacoEditorJson } from "../MonacoEditorJson";

type Props = ActionFormProps<Omit<CustomJavascriptAction, "name">>;

export const CustomJavascriptActionForm = ({ form }: Props) => {
  const [codeResult, setCodeResult] = useState<any>();

  const onClickRunCode = () => {
    let result = new Function(form.values.code)();
    setCodeResult(result);
  };

  return (
    <Stack spacing="xs">
      <MonacoEditorJson height="250px" {...form.getInputProps("body")} />
      <Button
        variant="default"
        sx={{ marginRight: 0 }}
        size="xs"
        leftIcon={<IconPlayerPlayFilled size={8} />}
        type="button"
        onClick={onClickRunCode}
      >
        Run Code
      </Button>

      {codeResult && (
        <div style={{ height: 200, width: "100%", border: "1px solid #000" }}>
          {codeResult}
        </div>
      )}
    </Stack>
  );
};
