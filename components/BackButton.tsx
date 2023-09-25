import { Button } from "@mantine/core";

export default function BackButton({ onClick }: { onClick: any }) {
  return (
    <Button onClick={onClick} variant="outline">
      Back
    </Button>
  );
}
