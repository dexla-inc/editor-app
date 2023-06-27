import { Button } from "@mantine/core";

type SubmitButtonProps = {
  isSubmit: true;
  onClick?: never;
  isLoading: boolean;
  disabled?: boolean;
};
type RegularButtonProps = {
  isSubmit?: false;
  onClick?: () => void;
  isLoading: boolean;
  disabled?: boolean;
};
type NextButtonProps = SubmitButtonProps | RegularButtonProps;

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
