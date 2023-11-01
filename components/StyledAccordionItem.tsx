import { Accordion, AccordionItemProps } from "@mantine/core";

export type StyledAccordionItemProps = {
  value: string;
  description?: string;
} & AccordionItemProps;

export default function StyledAccordionItem({
  value = "Control Test",
  description = "Panel Test",
}: StyledAccordionItemProps) {
  console.log(value, description);
  return (
    <Accordion.Item value={value} sx={{ fontWeight: 500 }}>
      <Accordion.Control sx={{ fontWeight: 500 }}>{value}</Accordion.Control>
      <Accordion.Panel>{description}</Accordion.Panel>
    </Accordion.Item>
  );
}
