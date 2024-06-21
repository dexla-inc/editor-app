import { TopLabel } from "@/components/TopLabel";
import isEmpty from "lodash.isempty";
import { BindingContextSelector } from "@/components/editor/BindingField/components/BindingContextSelector";
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
    <Stack spacing={1} style={{ flexGrow: 1 }} maw={400}>
      <TopLabel text={label} mt={4} required />
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
            {extractContextAndAttributes(value ?? "")}
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
  const regexWithComment = /(\w+)\[\/\* (.*?) \*\/ ?'.*?'\](.*)/;
  const regexWithoutComment = /(\w+)\['(.*?)'\](.*)/;
  let match = input.match(regexWithComment);

  if (!match) {
    match = input.match(regexWithoutComment);
  }

  if (match) {
    const keyword = match[1];
    const comment = match[2];
    const attributes = match[3];

    const formattedAttributes = attributes.replace(/\['.*?'\]/, "").trim();

    return `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${comment.charAt(0).toUpperCase() + comment.slice(1)}${formattedAttributes}`;
  }

  return "";
}
