import { BindingField } from "@/components/editor/BindingField/BindingField";
import { usePageListQuery } from "@/hooks/editor/reactQuery/usePageListQuery";
import { useEditorParams } from "@/hooks/editor/useEditorParams";
import { ActionFormProps, NavigationAction } from "@/utils/actions";
import { ICON_DELETE, ICON_SIZE } from "@/utils/config";
import {
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { ActionIconDefault } from "../ActionIconDefault";
import { Icon } from "../Icon";
import { SegmentedControlYesNo } from "../SegmentedControlYesNo";

type Props = ActionFormProps<Omit<NavigationAction, "name">>;

export const NavigationActionForm = ({ form, isPageAction }: Props) => {
  const { id: projectId } = useEditorParams();
  const { data: pageListQuery } = usePageListQuery(projectId, null);

  const onClickAddQueryString = () => {
    form.insertListItem("queryStrings", { key: "", value: {} });
  };

  const onClickRemoveQueryString = (index: number) => {
    form.removeListItem("queryStrings", index);
  };

  return (
    <Stack>
      {isPageAction && (
        <SegmentedControlYesNo
          label="Run in edit mode"
          {...form.getInputProps("runInEditMode")}
          onChange={(value) => {
            form.setFieldValue("runInEditMode", value);
          }}
        />
      )}
      <Select
        size="xs"
        placeholder="Select a page"
        label="Page"
        searchable
        data={
          pageListQuery?.results.map((page) => {
            return {
              label: page.title,
              value: page.id,
            };
          }) ?? []
        }
        {...form.getInputProps("pageId")}
        onChange={(value) => {
          const page = pageListQuery?.results.find((page) => page.id === value);
          form.setValues({
            pageId: value as string,
            pageSlug: page?.slug ?? "",
          });
        }}
      />
      <Flex justify="space-between" align="center">
        <Text fz="xs" weight="500">
          Query Strings
        </Text>

        <Button
          type="button"
          compact
          onClick={onClickAddQueryString}
          variant="default"
          sx={{ marginRight: 0 }}
          leftIcon={<Icon name="IconPlus" size={ICON_SIZE} />}
        >
          Add
        </Button>
      </Flex>
      {(form.values.queryStrings ?? [])?.map(({ key, value }, index) => (
        <Group key={index} style={{ flexWrap: "nowrap" }} align="end">
          <TextInput
            placeholder="key"
            size="xs"
            style={{ width: "50%" }}
            {...form.getInputProps(`queryStrings.${index}.key`)}
          />
          <BindingField
            fieldType="Text"
            placeholder="value"
            size="xs"
            label=""
            {...form.getInputProps(`queryStrings.${index}.value`)}
            isPageAction={isPageAction}
          />
          <ActionIconDefault
            iconName={ICON_DELETE}
            tooltip="Delete"
            onClick={() => onClickRemoveQueryString(index)}
          />
        </Group>
      ))}
      <SegmentedControlYesNo
        label="Open in new tab"
        {...form.getInputProps("openInNewTab")}
        onChange={(value) => {
          form.setFieldValue("openInNewTab", value);
        }}
      />
    </Stack>
  );
};
