import { BORDER_COLOR } from "@/utils/branding";
import { Accordion, AccordionProps, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderRadius: theme.radius.sm,
  },
  label: {
    fontWeight: 500,
  },
  item: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    border: `${rem(1)} solid transparent`,
    position: "relative",
    zIndex: 0,
    transition: "transform 150ms ease",
    fontWeight: 500,

    "&[data-active]": {
      transform: "scale(1.03)",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor: BORDER_COLOR,
      borderRadius: theme.radius.md,
      zIndex: 1,
      fontWeight: 400,
    },
  },

  chevron: {
    "&[data-rotate]": {
      transform: "rotate(-90deg)",
    },
  },
}));

type Props = {
  defaultValue?: string;
  children?: React.ReactNode;
} & AccordionProps;

export default function StyledAccordion({
  defaultValue,
  children,
  ...props
}: Props) {
  const { classes } = useStyles();

  return (
    <Accordion
      mx="auto"
      variant="filled"
      defaultValue={defaultValue}
      classNames={classes}
      className={classes.root}
      {...props}
    >
      {children}
    </Accordion>
  );
}
