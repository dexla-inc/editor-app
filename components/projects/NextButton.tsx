import { Button } from "@mantine/core";

interface NextButtonProps {
  onClick: any;
  isLoading: boolean;
  disabled: boolean;
}

export default function NextButton({
  onClick,
  isLoading,
  disabled,
}: NextButtonProps) {
  return (
    <Button
      onClick={onClick}
      //type="submit"
      loading={isLoading}
      disabled={disabled}
    >
      Next
    </Button>
  );
}
