import { Icon } from "@/components/Icon";
import { BG_COLOR, DEFAULT_TEXTCOLOR } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Popover,
  ScrollArea,
  SegmentedControl,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconExternalLink, IconPlugConnected } from "@tabler/icons-react";
import { BoundCodeForm } from "@/components/editor/BindingField/handlers/BoundCodeForm";
import { RulesForm } from "@/components/editor/BindingField/handlers/RulesForm";
import { useBindingField } from "@/components/editor/BindingField/components/ComponentToBindFromInput";

const ML = 5;

type BinderType = "boundCode" | "rules";

type Props = {
  controls: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  style?: "input" | "iconButton";
};

export default function BindingPopover({
  controls: { isOpen, onOpen, onClose },
  style = "iconButton",
}: Props) {
  const { value, onChange, label } = useBindingField();
  const onChangeDataTypeAsBoundCode = () => {
    onChange({
      ...value,
      dataType: "rules",
    });
    onOpen();
  };

  const onClickUnbind = () => {
    onChange({
      ...value,
      dataType: "static",
    });
    onClose();
  };

  return (
    <Popover
      opened={isOpen}
      withinPortal
      arrowPosition="center"
      position="left-end"
      onClose={onClose}
    >
      <Popover.Target>
        {style === "iconButton" ? (
          <Tooltip label="Bind Logic" withArrow position="top-end">
            <ActionIcon
              onClick={onChangeDataTypeAsBoundCode}
              variant="default"
              tabIndex={-1}
            >
              <IconPlugConnected size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        ) : (
          <ActionIcon
            onClick={onChangeDataTypeAsBoundCode}
            size="xs"
            tabIndex={-1}
            ml="xs"
          >
            <IconExternalLink size={ICON_SIZE} />
          </ActionIcon>
        )}
      </Popover.Target>
      <Popover.Dropdown
        sx={{
          maxHeight: "98%",
          backgroundColor: BG_COLOR,
          right: "0px !important",
        }}
      >
        <Stack w={500}>
          {/* Pass in the name of the thing that is being bound */}
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="xs">
              <Icon name="IconPlugConnected" color={DEFAULT_TEXTCOLOR} />
              <Title order={5}>Binder {label ? `- ${label}` : ""}</Title>
            </Flex>
            <CloseButton onClick={onClose} />
          </Flex>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="xs">
              <SegmentedControl
                value={value?.dataType}
                onChange={(b: BinderType) =>
                  onChange({ ...value, dataType: b })
                }
                data={[
                  {
                    value: "rules",
                    disabled: false,
                    label: (
                      <Center>
                        <Icon name="IconVariable" />
                        <Text ml={ML}>Rules</Text>
                      </Center>
                    ),
                  },
                  {
                    value: "boundCode",
                    label: (
                      <Center>
                        <Icon name="IconCode" />
                        <Text ml={ML}>JavaScript</Text>
                      </Center>
                    ),
                  },
                ]}
              />
              <Button onClick={onClickUnbind}>Unbind</Button>
            </Flex>
            <ActionIcon variant="light" radius="xl">
              <Icon name="IconCopy" />
            </ActionIcon>
          </Flex>
          <Box
            mih={200}
            mah={700}
            sx={{
              overflowY: "auto",
            }}
          >
            {value?.dataType === "rules" && <RulesForm />}
            {value?.dataType === "boundCode" && <BoundCodeForm />}
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
