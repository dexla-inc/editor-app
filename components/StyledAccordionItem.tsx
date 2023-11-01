import { Accordion, AccordionItemProps } from "@mantine/core";

export type StyledAccordionItemProps = {
  value: string;
  description?: string;
} & AccordionItemProps;

export default function StyledAccordionItem({
  value,
  description,
  ...props
}: StyledAccordionItemProps) {
  return (
    <Accordion.Item value={value} {...props}>
      <Accordion.Control>{value}</Accordion.Control>
      <Accordion.Panel>{description}</Accordion.Panel>
    </Accordion.Item>
  );
}
