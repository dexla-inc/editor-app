import { useEditorStore } from "@/stores/editor";
import { ASIDE_WIDTH } from "@/utils/config";
import { getComponentById } from "@/utils/editor";
import {
  Box,
  Center,
  Group,
  NumberInput,
  NumberInputProps,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBoxMargin } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useEffect } from "react";

export const icon = IconBoxMargin;
export const label = "Spacing";

const ValueInput = (props: NumberInputProps) => {
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const updateTreeComponent = useEditorStore(
    (state) => state.updateTreeComponent
  );

  const debouncedTreeUpdate = debounce(updateTreeComponent, 400);

  return (
    <NumberInput
      styles={{
        input: {
          textAlign: "center",
          fontSize: 10,
        },
      }}
      variant="unstyled"
      radius={0}
      hideControls
      size="xs"
      maw={50}
      {...props}
      onChange={(value) => {
        props.onChange?.(value);
        debouncedTreeUpdate(selectedComponentId as string, {
          style: { [props.name!]: value },
        });
      }}
    />
  );
};

export const Modifier = () => {
  const theme = useMantineTheme();
  const selectedComponentId = useEditorStore(
    (state) => state.selectedComponentId
  );
  const editorTree = useEditorStore((state) => state.tree);
  const selectedComponent = getComponentById(
    editorTree.root,
    selectedComponentId as string
  );

  const form = useForm({
    initialValues: {
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  });

  useEffect(() => {
    if (selectedComponent) {
      const {
        marginTop = 0,
        marginBottom = 0,
        marginLeft = 0,
        marginRight = 0,
        paddingTop = 0,
        paddingBottom = 0,
        paddingLeft = 0,
        paddingRight = 0,
      } = selectedComponent.props?.style || {};
      form.setValues({
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
      });
    }
    // Disabling the lint here because we don't want this to be updated every time the form changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent]);

  return (
    <form>
      <Box w="100%" pos="relative">
        <Text
          pos="absolute"
          top={14}
          left={30}
          size={10}
          color="teal.6"
          weight="bold"
          sx={{ zIndex: 10 }}
        >
          Margin
        </Text>
        <Text
          pos="absolute"
          top={69}
          left={82}
          size={10}
          color="teal.6"
          weight="bold"
          sx={{ zIndex: 10 }}
        >
          Padding
        </Text>
        <Box
          top={0}
          left={0}
          pos="absolute"
          sx={{
            height: ASIDE_WIDTH - 32,
            width: ASIDE_WIDTH - 32,
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 100 100"
            sx={{
              height: "100%",
              width: "100%",
              "> polygon": {
                fill: theme.colors.teal[0],
                stroke: theme.colors.teal[2],
                strokeLinejoin: "round",
                strokeWidth: 0.5,
              },
            }}
          >
            <polygon points="5,5 50,50 95,5" />
            <polygon
              points="5,5 50,50 5,95"
              style={{ fill: theme.colors.teal[1] }}
            />
            <polygon points="5,95 50,50 95,95" />
            <polygon
              points="95,5 50,50 95,95"
              style={{ fill: theme.colors.teal[1] }}
            />
            <rect
              x="25"
              y="25"
              width={50}
              height={50}
              style={{
                fill: "none",
                stroke: theme.colors.teal[3],
                strokeWidth: 1,
              }}
            />
            <rect
              x="42.5"
              y="42.5"
              width={15}
              height={15}
              style={{
                fill: "white",
                stroke: theme.colors.teal[3],
                strokeWidth: 1,
              }}
            />
          </Box>
        </Box>
        <Center>
          <Box h={ASIDE_WIDTH - 32} w={ASIDE_WIDTH - 32} pt={29}>
            <Center>
              <ValueInput
                name="marginTop"
                {...form.getInputProps("marginTop")}
              />
            </Center>
            <Group w="100%" position="apart" noWrap spacing={0} px="md">
              <ValueInput
                name="marginLeft"
                {...form.getInputProps("marginLeft")}
              />
              <Box w={160} h={150}>
                <Stack
                  h="100%"
                  spacing={4}
                  sx={{ justifyContent: "center" }}
                  p={2}
                >
                  <Center>
                    <ValueInput
                      name="paddingTop"
                      {...form.getInputProps("paddingTop")}
                    />
                  </Center>
                  <Group w="100%" position="apart">
                    <ValueInput
                      name="paddingLeft"
                      {...form.getInputProps("paddingLeft")}
                    />
                    <ValueInput
                      name="paddingRight"
                      {...form.getInputProps("paddingRight")}
                    />
                  </Group>
                  <Center>
                    <ValueInput
                      name="paddingBottom"
                      {...form.getInputProps("paddingBottom")}
                    />
                  </Center>
                </Stack>
              </Box>
              <ValueInput
                name="marginRight"
                {...form.getInputProps("marginRight")}
              />
            </Group>
            <Center>
              <ValueInput
                name="marginBottom"
                {...form.getInputProps("marginBottom")}
              />
            </Center>
          </Box>
        </Center>
      </Box>
    </form>
  );
};
