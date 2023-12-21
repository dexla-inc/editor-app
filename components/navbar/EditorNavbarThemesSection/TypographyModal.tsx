import {
  Button,
  Container,
  Group,
  Modal,
  Select,
  SelectItem,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { INPUT_SIZE } from "@/utils/config";
import { SelectFont } from "@/components/navbar/EditorNavbarThemesSection/SelectFont";
import { useQuery } from "@tanstack/react-query";
import { getGoogleFonts } from "@/utils/googleFonts";
import { ThemeResponse } from "@/requests/themes/types";
import { UseFormReturnType } from "@mantine/form";
import { pixelMetrics } from "@/components/navbar/EditorNavbarThemesSection/index";

type TypographyModalProps = {
  controls: { opened: boolean; close: () => void };
  form: UseFormReturnType<ThemeResponse>;
  onSubmit: () => void;
  weightsList: Array<SelectItem>;
};

export const TypographyModal = ({
  controls,
  form,
  onSubmit,
  weightsList = [],
}: TypographyModalProps) => {
  const { data: googleFontsData = [] } = useQuery({
    queryKey: ["fonts"],
    queryFn: () => getGoogleFonts(),
  });

  return (
    <Modal
      opened={controls.opened}
      onClose={controls.close}
      size="xl"
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
                    if (!font.tag.toLowerCase().startsWith("h")) {
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
                    if (font.tag.toLowerCase().startsWith("h")) {
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
                          value={
                            font.lineHeight === 1
                              ? "0"
                              : String(
                                  Math.round(
                                    (Number(font.lineHeight) - 1) * 100,
                                  ),
                                )
                          }
                          onChange={(value) => {
                            form.setFieldValue(
                              `fonts.${index}.lineHeight`,
                              String(Number(value) / 100 + 1),
                            );
                          }}
                          size={INPUT_SIZE}
                        />
                      </td>
                      <td>
                        <Select
                          data={pixelMetrics}
                          {...form.getInputProps(
                            `fonts.${index}.letterSpacing`,
                          )}
                          size={INPUT_SIZE}
                        />
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
