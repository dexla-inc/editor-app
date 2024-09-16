import { ActionIconDefault } from "@/components/ActionIconDefault";
import { SegmentedControlInput } from "@/components/SegmentedControlInput";
import { UnitInput } from "@/components/UnitInput";
import { SelectFont } from "@/components/navbar/EditorNavbarThemesSection/SelectFont";
import { pixelMetrics } from "@/components/navbar/EditorNavbarThemesSection/index";
import { useGoogleFontsQuery } from "@/hooks/editor/reactQuery/useGoogleFontsQuery";
import { ExtendedUserTheme } from "@/requests/themes/types";
import { INPUT_SIZE } from "@/utils/config";
import {
  Button,
  Container,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type TypographyModalProps = {
  controls: { opened: boolean; close: () => void };
  form: UseFormReturnType<ExtendedUserTheme>;
  onSubmit: () => void;
  currentFontIndex: number;
};

export const TypographyModal = ({
  controls,
  form,
  onSubmit,
  currentFontIndex,
}: TypographyModalProps) => {
  const { data: googleFontsData = [] } = useGoogleFontsQuery();

  const weightsList =
    googleFontsData
      .find(
        (f: any) =>
          f.family === form.values.fonts[currentFontIndex]?.fontFamily,
      )
      ?.weights?.map((weight: string) => ({
        value: weight,
        label: weight,
      })) || [];

  return (
    <Modal
      opened={controls.opened}
      onClose={controls.close}
      size="70%"
      styles={{ overlay: { zIndex: 300 }, inner: { zIndex: 400 } }}
    >
      <Container>
        <form onSubmit={onSubmit}>
          <Stack spacing="xl">
            <Title order={2}>Typography Settings</Title>

            <Group>
              <SelectFont
                label="Default Font Family"
                {...form.getInputProps("defaultFont")}
                onChange={(value: string) => {
                  form.setFieldValue(`defaultFont`, value);
                  form.values.fonts.forEach((font, index) => {
                    if (!font.tag?.toLowerCase().startsWith("h")) {
                      form.setFieldValue(`fonts.${index}.fontFamily`, value);
                    }
                  });
                }}
              />
              <SelectFont
                label="Headings Font Family"
                value={form.values.fonts[0]?.fontFamily}
                onChange={(value: string) => {
                  form.values.fonts.forEach((font, index) => {
                    if (font.tag?.toLowerCase().startsWith("h")) {
                      form.setFieldValue(`fonts.${index}.fontFamily`, value);
                    }
                  });
                }}
              />
            </Group>

            <Table>
              <thead>
                <tr>
                  <th>Style Name</th>
                  <th>Weight</th>
                  <th>Size</th>
                  <th>Line Height</th>
                  <th>Letter Spacing</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {form.values.fonts.map((font, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                        <TextInput
                          {...form.getInputProps(`fonts.${index}.tag`)}
                          styles={{
                            root: { width: "100px" },
                            input: {
                              fontSize: `${font.fontSize}px`,
                              fontWeight: Number(font.fontWeight),
                              fontFamily: font.fontFamily,
                              letterSpacing: `${font.letterSpacing}px`,
                              border: "none",
                              marginTop: `calc(${font.lineHeight}px / 2)`,
                              marginBottom: `calc(${font.lineHeight}px / 2)`,
                            },
                          }}
                        />
                      </td>
                      <td>
                        <Select
                          size={INPUT_SIZE}
                          {...form.getInputProps(`fonts.${index}.fontWeight`)}
                          data={weightsList}
                        />
                      </td>
                      <td>
                        <Select
                          data={pixelMetrics}
                          {...form.getInputProps(`fonts.${index}.fontSize`)}
                          size={INPUT_SIZE}
                        />
                      </td>
                      <td>
                        <Select
                          data={pixelMetrics}
                          {...form.getInputProps(`fonts.${index}.lineHeight`)}
                          size={INPUT_SIZE}
                        />
                      </td>
                      <td>
                        <UnitInput
                          w={100}
                          options={[{ value: "px", label: "px" }]}
                          {...form.getInputProps(
                            `fonts.${index}.letterSpacing`,
                          )}
                          size={INPUT_SIZE}
                        />
                      </td>
                      <td>
                        <SegmentedControlInput
                          data={[
                            {
                              label: "TITLE",
                              value: "TITLE",
                            },
                            {
                              label: "TEXT",
                              value: "TEXT",
                            },
                          ]}
                          {...form.getInputProps(`fonts.${index}.type`)}
                          onChange={(value) => {
                            form.setFieldValue(`fonts.${index}.type`, value);
                          }}
                        />
                      </td>
                      <td>
                        <ActionIconDefault
                          iconName="IconTrash"
                          color="red"
                          tooltip="Delete"
                          onClick={() => form.removeListItem("fonts", index)}
                        >
                          Delete
                        </ActionIconDefault>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Stack>
          <Group position="apart" mt={20}>
            <Button
              variant="default"
              type="button"
              onClick={() => {
                form.insertListItem("fonts", {});
              }}
            >
              + Add new Font
            </Button>
            <Button type="submit">Save</Button>
          </Group>
        </form>
      </Container>
    </Modal>
  );
};
