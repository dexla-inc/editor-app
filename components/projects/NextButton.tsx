import { Button } from "@mantine/core";

interface NextButtonProps {
  onClick?: any;
  isLoading: boolean;
  disabled?: boolean;
  isSubmit?: boolean;
}

export default function NextButton({
  onClick,
  isLoading,
  disabled,
  isSubmit,
}: NextButtonProps) {
  return (
    <Button
      onClick={onClick}
      type={isSubmit ? "submit" : "button"}
      loading={isLoading}
      disabled={disabled}
    >
      Next
    </Button>
  );
}
