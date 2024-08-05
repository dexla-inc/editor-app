import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";
import { TopLabel } from "@/components/TopLabel";
import { isEmpty } from "@/utils/common";
import { Anchor, Group, Stack, Text } from "@mantine/core";

type LocationField = {
  value: string;
  onChange: (val: string) => void;
  label?: string;
};

export const LocationField = ({
  value,
  onChange,
  label = "Location",
}: LocationField) => {
  return (
    <Stack spacing={1} style={{ flexGrow: 1 }} mt={4}>
      <TopLabel text={label} required />
      {isEmpty(value) && (
        <BindingContextSelector
          setSelectedItem={(selectedItem: string) =>
            onChange(`return ${selectedItem}`)
          }
        />
      )}
      {isEmpty(value) || (
        <Group>
          <Text size="xs" weight="bold">
            {extractContextAndAttributes(value ?? "").context}
          </Text>
          <Anchor
            variant="default"
            onClick={() => onChange(undefined as any)}
            size="xs"
          >
            Edit
          </Anchor>
        </Group>
      )}
    </Stack>
  );
};

export function extractContextAndAttributes(input: string = "") {
  const regex = /(\w+)\[(?:\/\* (.*?) \*\/ ?'(.*?)'|'(.*?)')\](.*)/;
  const match = input.match(regex);

  if (!match) return { context: "" };

  const [, keyword, comment, id, altComment, attributes] = match;
  const actualComment = comment || altComment;

  const context = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${actualComment.charAt(0).toUpperCase() + actualComment.slice(1)}${attributes.trim()}`;

  return {
    id: input.includes("components") ? id : undefined,
    context,
  };
}
