import { Icon } from "@/components/Icon";
import { BG_COLOR, DEFAULT_TEXTCOLOR } from "@/utils/branding";
import { ICON_SIZE } from "@/utils/config";
import { ValueProps } from "@/types/dataBinding";
import {
  ActionIcon,
  Button,
  Center,
  CloseButton,
  Flex,
  Popover,
  SegmentedControl,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconExternalLink, IconPlugConnected } from "@tabler/icons-react";
import { useState } from "react";
import { JavascriptTab } from "@/components/bindingPopover/formTab/JavascriptTab";
import { BindingContextProvider } from "@/components/bindingPopover/BindingContextProvider";
import { RulesTab } from "@/components/bindingPopover/formTab/RulesTab";

const ML = 5;

type BinderType = "javascript" | "rules";

type Props = {
  value: ValueProps;
  onChange: (value: ValueProps) => void;
  controls: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
  style?: "input" | "iconButton";
  isPageAction?: boolean;
};

export default function BindingPopover({
  value,
  onChange,
  controls: { isOpen, onOpen, onClose },
  style = "iconButton",
  isPageAction,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<string>();
  const [selectedBinderType, setSelectedBinderType] =
    useState<BinderType>("javascript");
  const onChangeDataTypeAsBoundCode = () => {
    onChange({
      ...value,
      dataType: "boundCode",
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
              ml="xs"
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
              <Title order={5}>Binder</Title>
            </Flex>
            <CloseButton onClick={onClose} />
          </Flex>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="xs">
              <SegmentedControl
                value={selectedBinderType}
                onChange={(b: BinderType) => setSelectedBinderType(b)}
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
                    value: "javascript",
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
          <BindingContextProvider isPageAction={isPageAction}>
            {selectedBinderType === "rules" && <RulesTab />}
            {selectedBinderType === "javascript" && (
              <JavascriptTab
                value={value}
                onChange={onChange}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            )}
          </BindingContextProvider>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
