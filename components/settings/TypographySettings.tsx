import {
  Button,
  Container,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { INPUT_SIZE } from "@/utils/config";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { ThemeResponse } from "@/requests/themes/types";
import { getGoogleFonts } from "@/utils/googleFonts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTheme } from "@/requests/themes/queries";
import { saveTheme } from "@/requests/themes/mutations";
import { useAppStore } from "@/stores/app";
import { UnitInput } from "@/components/UnitInput";

type Props = {
  projectId: string;
};

const SelectFont = ({ value, onChange }: any) => {
  const [fontSearch, setFontSearch] = useState("");

  const { data = [] } = useQuery({
    queryKey: ["fonts"],
    queryFn: () => getGoogleFonts(),
  });

  return (
    <Select
      placeholder="Choose font"
      value={value}
      data={data
        .map((f: any) => f.family)
        .filter((f: string) =>
          f.toLowerCase().includes(fontSearch.toLowerCase()),
        )
        .slice(0, 10)}
      onChange={onChange}
      searchable
      searchValue={fontSearch}
      onSearchChange={setFontSearch}
      size={INPUT_SIZE}
    />
  );
};

export const TypographySettings = ({ projectId }: Props) => {
  const queryClient = useQueryClient();
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);

  const { data = [] } = useQuery({
    queryKey: ["fonts"],
    queryFn: () => getGoogleFonts(),
  });

  const form = useForm<ThemeResponse>({
    initialValues: {
      colors: [],
      fonts: [],
      responsiveBreakpoints: [],
      faviconUrl: "",
      logoUrl: "",
      logos: [],
      defaultRadius: "sm",
      defaultSpacing: "md",
      cardStyle: "OUTLINED_ROUNDED",
      loader: "OVAL",
      focusRing: "DEFAULT",
      hasCompactButtons: true,
      defaultFont: "Arial, sans-serif",
      theme: "LIGHT",
    },
    validate: {},
  });

  useQuery({
    queryKey: ["theme"],
    queryFn: async () => {
      const theme = await getTheme(projectId);
      form.setValues(theme);
    },
    enabled: !!projectId,
  });

  const { mutate } = useMutation(saveTheme, {
    onSettled(_, err) {
      if (err) {
        console.error(err);
      }

      queryClient.invalidateQueries(["theme"]);
    },
  });

  const onSubmit = async (values: ThemeResponse) => {
    try {
      startLoading({
        id: "saving-brand",
        title: "Saving Brand",
        message: "Wait while your brand is being saved",
      });

      form.validate();

      await mutate({ params: values, projectId: projectId });

      stopLoading({
        id: "saving-brand",
        title: "Brand Saved",
        message: "The brand was saved successfully",
      });
    } catch (error) {
      console.error(error);
      stopLoading({
        id: "saving-brand",
        title: "Saving Brand Failed",
        message: "Validation failed",
      });
    }
  };

  return (
    <Container py="xl">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack spacing="xl">
          <Title order={2}>Typography Settings</Title>
          <Table>
            <thead>
              <tr>
                <th>Style Name</th>
                <th>Font</th>
                <th>Weight</th>
                <th>Size</th>
                <th>Line Height</th>
                <th>Letter Spacing</th>
                <th>Note</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {form.values.fonts.map((font, index) => {
                const { variants = [] } =
                  data.find((f: any) => f.family === font.fontFamily) ?? {};

                return (
                  <tr key={index}>
                    <td>
                      <TextInput
                        {...form.getInputProps(`fonts.${index}.tag`)}
                      />
                    </td>
                    <td>
                      <SelectFont
                        {...form.getInputProps(`fonts.${index}.fontFamily`)}
                      />
                    </td>
                    <td>
                      <Select
                        {...form.getInputProps(`fonts.${index}.fontWeight`)}
                        data={variants.filter((v: string) => !isNaN(Number(v)))}
                      />
                    </td>
                    <td>
                      <UnitInput
                        size={INPUT_SIZE}
                        {...form.getInputProps(`fonts.${index}.fontSize`)}
                      />
                    </td>
                    <td>
                      <UnitInput
                        size={INPUT_SIZE}
                        {...form.getInputProps(`fonts.${index}.lineHeight`)}
                      />
                    </td>
                    <td>
                      <UnitInput
                        size={INPUT_SIZE}
                        {...form.getInputProps(`fonts.${index}.letterSpacing`)}
                      />
                    </td>
                    <td>
                      <TextInput
                        {...form.getInputProps(`fonts.${index}.note`)}
                      />
                    </td>
                    <td>
                      <Text
                        component={font.tag as any}
                        fz={font.fontSize}
                        fw={font.fontWeight}
                        sx={{
                          fontFamily: font.fontFamily,
                          lineHeight: font.lineHeight,
                          letterSpacing: font.letterSpacing,
                        }}
                      >
                        Preview Text
                      </Text>
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
  );
};
