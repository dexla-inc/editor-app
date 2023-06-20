import BackButton from "@/components/projects/BackButton";
import { StepperClickEvents } from "@/utils/projectTypes";
import { Group } from "@mantine/core";

export default function GenerateAppStep({ prevStep }: StepperClickEvents) {
  return (
    <Group position="apart">
      <BackButton onClick={prevStep as () => void}></BackButton>
    </Group>
  );
}
