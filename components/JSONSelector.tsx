import { BG_COLOR, BUTTON_HOVER } from "@/utils/branding";
import { ObjectItem, objToItems } from "@/utils/common";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Button,
  Card,
  CardProps,
  Collapse,
  Group,
  List,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import DataItemValuePreview from "./DataItemValuePreview";

type Props = {
  data?: any;
  onSelectValue?: (value: any) => void;
  name?: string;
};

export const JSONSelector = ({ data, onSelectValue, name }: Props) => {
  name = name ?? "data";
  const items: ObjectItem[] = objToItems(data, data);

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

type ListItemProps = {
  item: ObjectItem;
  onSelectValue?: (value: any) => void;
  name?: string;
} & CardProps;

const ListItem = ({ item, children, onSelectValue }: ListItemProps) => {
  const { ref, hovered } = useHover();
  const [opened, { toggle }] = useDisclosure(false);

  const canExpand = (item.children ?? [])?.length > 0;

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
