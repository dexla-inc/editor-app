import { BG_COLOR, BUTTON_HOVER } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Button,
  Card,
  CardProps,
  Collapse,
  Group,
  List,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import DataItemValuePreview from "./DataItemValuePreview";

type Item = {
  key: string;
  value: string;
  path: string;
  type: string;
  children?: Item[];
};

type ListItemProps = {
  item: Item;
  onSelectValue?: (value: any) => void;
  name?: string;
} & CardProps;

const findPathForKeyValue = (
  obj: any,
  key: string,
  value: any,
  currentPath: string = "",
): string | null => {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const newPath = currentPath
        ? `${currentPath}.${isArrayIndex(prop) ? `[${prop}]` : prop}`
        : isArrayIndex(prop)
        ? `[${prop}]`
        : prop;

      if (prop === key && obj[prop] === value) {
        return newPath;
      } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
        const path = findPathForKeyValue(obj[prop], key, value, newPath);
        if (path !== null) {
          return path;
        }
      }
    }
  }

  return null;
};

const isArrayIndex = (prop: string): boolean => {
  // Check if prop is a non-negative integer (array index).
  return /^\d+$/.test(prop);
};

const objToItems = (obj: any, root: any): Item[] => {
  if (!obj) return [];
  return Object.entries(obj).map(([key, value]) => {
    let path = findPathForKeyValue(root, key, value);
    if (Array.isArray(value) && !path?.includes("[")) {
      path = `${path}[0]`;
    }

    return {
      key,
      value: JSON.stringify(value),
      path: path ? path.replaceAll(".[", "[") : "",
      type: typeof value,
      children:
        value && typeof value === "object"
          ? objToItems(value, root)
          : undefined,
    };
  });
};

const ListItem = ({ item, children, onSelectValue }: ListItemProps) => {
  const theme = useMantineTheme();
  const { ref, hovered } = useHover();
  const [opened, { toggle }] = useDisclosure(false);

  const canExpand = (item.children ?? [])?.length > 0;
  const primaryColor = theme.colors[theme.primaryColor][6];

  return (
    <Group
      unstyled
      style={{
        borderLeft: "1px solid transparent",
      }}
    >
      <Card
        ref={ref}
        p={0}
        bg={hovered ? BUTTON_HOVER : BG_COLOR}
        sx={{
          cursor: "pointer",
          display: "flex",
          position: "relative",
        }}
      >
        <Group position="apart" noWrap w="100%">
          <Group
            spacing={4}
            noWrap
            w="100%"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
          >
            <ActionIcon
              sx={{
                visibility: canExpand ? "visible" : "hidden",
                pointerEvents: canExpand ? "all" : "none",
                width: canExpand ? "auto" : 0,
                minWidth: canExpand ? "auto" : 0,
                cursor: "pointer",
              }}
            >
              <IconChevronDown
                size={ICON_SIZE}
                style={{
                  transition: "transform 200ms ease",
                  transform: opened ? `none` : "rotate(-90deg)",
                }}
              />
            </ActionIcon>
            <Group noWrap>
              <Group noWrap spacing={0}>
                {canExpand ? (
                  <Text id={item.key} size="xs" lineClamp={1}>
                    {item.key}
                  </Text>
                ) : (
                  <Button
                    id={item.key}
                    size="xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectValue?.(item);
                    }}
                  >
                    {item.key}
                  </Button>
                )}

                {item.key !== "root" && item.value && (
                  <DataItemValuePreview value={item.value} />
                )}
              </Group>
            </Group>
          </Group>
        </Group>
      </Card>
      <Collapse key={`${item.key}-${opened}`} in={opened}>
        {children}
      </Collapse>
    </Group>
  );
};

const ListItemWrapper = ({
  item,
  children,
  onSelectValue,
  name,
}: ListItemProps) => {
  return (
    <List
      withPadding={item.key !== name}
      size="xs"
      listStyleType="none"
      styles={{
        itemWrapper: {
          width: "100%",
        },
      }}
    >
      <List.Item key={item.key} w="100%">
        <ListItem item={item} onSelectValue={onSelectValue}>
          {(item.children ?? [])?.length > 0 && (
            <List
              size="xs"
              listStyleType="none"
              styles={{
                itemWrapper: {
                  width: "100%",
                },
              }}
            >
              {children}
            </List>
          )}
        </ListItem>
      </List.Item>
    </List>
  );
};

type Props = {
  data?: any;
  onSelectValue?: (value: any) => void;
  name?: string;
};

export const JSONSelector = ({ data, onSelectValue, name }: Props) => {
  name = name ?? "data";
  const items: Item[] = objToItems(data, data);

  const renderList = (item: any) => {
    if (!item) {
      return null;
    }

    return (
      <ListItemWrapper
        key={item.key}
        item={item}
        onSelectValue={onSelectValue}
        sx={{ width: "100%" }}
        name={name}
      >
        {item.children?.map((child: any) => {
          return renderList(child);
        })}
      </ListItemWrapper>
    );
  };

  return (
    <List w="100%" size="xs" listStyleType="none">
      {renderList({
        key: name,
        path: "[0]",
        value: JSON.stringify(items),
        children: items,
      })}
    </List>
  );
};
