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

export function extractContextAndAttributes(
  input: string = "",
  idOnly: boolean = false,
) {
  const regexWithComment = /(\w+)\[\/\* (.*?) \*\/ ?'(.*?)'\](.*)/;
  const regexWithoutComment = /(\w+)\['(.*?)'\](.*)/;
  const isWithComment = regexWithComment.test(input);
  const isComponent = input.includes("components");
  let match = input.match(regexWithComment);
  let context = "";
  let id: string | undefined = undefined;

  if (!match) {
    match = input.match(regexWithoutComment);
  }

  if (match) {
    const keyword = match[1];
    const comment = match[2];
    const attributes = isWithComment ? match[4] : match[3];
    id = isWithComment && isComponent ? match[3] : undefined;

    const formattedAttributes = attributes.replace(/\['.*?'\]/, "").trim();

    context = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${comment.charAt(0).toUpperCase() + comment.slice(1)}${formattedAttributes}`;
  }

  if (idOnly) {
    return id;
  }

  return context;
}
