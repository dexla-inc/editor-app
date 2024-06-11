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
import { FieldType } from "@/components/data/forms/StaticFormFieldsBuilder";

const ML = 5;

type BinderType = "boundCode" | "rules";

type Props = {
  value: ValueProps;
  fieldType: FieldType;
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
  fieldType,
  controls: { isOpen, onOpen, onClose },
  style = "iconButton",
  isPageAction,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<string>();
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
                value={value.dataType}
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
          <BindingContextProvider isPageAction={isPageAction}>
            {value.dataType === "rules" && (
              <RulesTab
                fieldType={fieldType}
                value={value}
                onChange={onChange}
              />
            )}
            {value.dataType === "boundCode" && (
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
