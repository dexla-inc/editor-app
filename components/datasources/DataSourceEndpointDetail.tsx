import { Icon } from "@/components/Icon";
import {
  createDataSourceEndpoint,
  updateDataSourceEndpoint,
} from "@/requests/datasources/mutations";
import {
  Endpoint,
  EndpointParams,
  Header,
  Parameter,
  RequestBody,
} from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useAppStore } from "@/stores/app";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Tabs,
  TextInput,
  Title,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Editor } from "@monaco-editor/react";
import { useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useEffect, useReducer } from "react";

const MethodTypeArray: MethodTypes[] = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
];
const MethodTypesWithRequestBody: MethodTypes[] = ["POST", "PATCH", "PUT"];

function getTitle(parameter: any) {
  switch (parameter.apiType) {
    case "header":
      return "Headers";
    case "body":
      return "Body";
    default:
      return "Parameters";
  }
}

type Defaults = {
  header: Header;
  parameter: Parameter;
  body: RequestBody;
};

type ApiType = "header" | "parameter" | "body";

const defaultConfig: { [K in keyof Defaults as ApiType]: Defaults[K] } = {
  header: {
    required: false,
    value: null,
    name: "",
    type: "string",
    description: null,
  },
  parameter: {
    location: "Query",
    required: false,
    name: "",
    type: "string",
    description: null,
  },
  body: {
    value: null,
    name: "",
    type: "string",
    description: null,
  },
};

const apiTypeToStateKey: Record<ApiType, keyof EndpointParams> = {
  header: "headers",
  parameter: "parameters",
  body: "requestBody",
};

type Action =
  | {
      type: "SET_FIELD";
      payload: { field: keyof EndpointParams; value: any };
    }
  | {
      type: "ADD_NEW";
      payload: {
        apiType: ApiType;
        newItem: Header | Parameter | RequestBody;
      };
    }
  | { type: "DELETE"; payload: { index: number; apiType: ApiType } }
  | {
      type: "UPDATE_ARRAY_FIELD";
      payload: {
        index: number;
        field: keyof Header | keyof Parameter | keyof RequestBody;
        value: any;
        apiType: ApiType;
      };
    };

type DataSourceEndpointDetailProps = {
  endpoint: Endpoint | EndpointParams;
  projectId: string;
  dataSourceId: string;
  setEndpointDetailVisible?: (visible: boolean) => void;
};

// Start of component
export const DataSourceEndpointDetail = ({
  endpoint,
  projectId,
  dataSourceId,
  setEndpointDetailVisible,
}: DataSourceEndpointDetailProps) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  const initialState: EndpointParams = {
    description: endpoint.description ?? null,
    methodType: endpoint.methodType ?? "GET",
    relativeUrl: endpoint.relativeUrl ?? "",
    headers: endpoint.headers ?? [],
    parameters: endpoint.parameters ?? [],
    requestBody: MethodTypesWithRequestBody.includes(endpoint.methodType)
      ? endpoint.requestBody
      : [],
    mediaType: endpoint.mediaType ?? "application/json",
    withCredentials: endpoint.withCredentials ?? null,
    authenticationScheme: endpoint.authenticationScheme ?? "NONE",
    exampleResponse: endpoint.exampleResponse ?? "",
    errorExampleResponse: endpoint.errorExampleResponse ?? "",
  };

  function reducer(state: EndpointParams, action: Action): EndpointParams {
    const { type, payload } = action;
    switch (type) {
      case "SET_FIELD":
        return { ...state, [payload.field]: payload.value };
      case "ADD_NEW":
        const addKey = apiTypeToStateKey[payload.apiType] as
          | "parameters"
          | "headers"
          | "requestBody";
        return {
          ...state,
          [addKey]: [...state[addKey], payload.newItem],
        };
      case "DELETE":
        const deleteKey = apiTypeToStateKey[payload.apiType] as
          | "parameters"
          | "headers"
          | "requestBody";
        const newArray = [...state[deleteKey]];
        newArray.splice(payload.index, 1);
        return { ...state, [deleteKey]: newArray };
      case "UPDATE_ARRAY_FIELD":
        const updateKey = apiTypeToStateKey[payload.apiType] as
          | "parameters"
          | "headers"
          | "requestBody";
        const updatedArray = [...state[updateKey]];
        // @ts-ignore
        updatedArray[payload.index][payload.field] = payload.value;
        return { ...state, [updateKey]: updatedArray };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const showRequestBody = MethodTypesWithRequestBody.includes(state.methodType);
  const requestBodyToDisplay = showRequestBody ? endpoint.requestBody : [];

  const handleFieldChange = (field: keyof EndpointParams, value: string) => {
    dispatch({ type: "SET_FIELD", payload: { field, value } });
  };

  const handleInputChange = (field: keyof EndpointParams, value: any) => {
    console.log(value);
    handleFieldChange(field, value);
  };
  const debouncedInputChange = debounce(handleInputChange, 300);

  const handleArrayChange = (
    index: number,
    field: keyof Header | keyof Parameter | keyof RequestBody,
    value: any,
    apiType: ApiType
  ) => {
    dispatch({
      type: "UPDATE_ARRAY_FIELD",
      payload: { index, field, value, apiType },
    });
  };

  const handleAddNew = (apiType: ApiType) => {
    const newItem = { ...defaultConfig[apiType], apiType };
    dispatch({ type: "ADD_NEW", payload: { apiType, newItem } });
  };

  const handleDelete = (index: number, apiType: ApiType) => {
    dispatch({ type: "DELETE", payload: { index, apiType } });
  };

  const form = useForm<EndpointParams>({
    validateInputOnBlur: true,
    initialValues: initialState,
    validate: {},
  });

  const onSubmit = async () => {
    const payload = {
      ...state,
      exampleResponse: state.exampleResponse,
      errorExampleResponse: state.errorExampleResponse,
    };

    try {
      startLoading({
        id: "saving",
        title: "Updating Data Source",
        message: "Wait while your data source is being saved",
      });

      form.validate();

      console.log("dataSourceId", dataSourceId);

      const result =
        "id" in endpoint
          ? await updateDataSourceEndpoint(
              projectId,
              dataSourceId ?? "",
              endpoint.id,
              payload
            )
          : await createDataSourceEndpoint(
              projectId,
              dataSourceId ?? "",
              payload
            );

      console.log(result);

      queryClient.refetchQueries(["endpoints"]);
      setEndpointDetailVisible && setEndpointDetailVisible(false);

      stopLoading({
        id: "saving",
        title: "Data Source Saved",
        message: "The data source was saved successfully",
      });
    } catch (error: any) {
      console.log(error);
      stopLoading({
        id: "saving",
        title: "Data Source Failed",
        message: error,
        isError: true,
      });
    }
  };

  useEffect(() => {
    const updatedRequestBody = showRequestBody ? requestBodyToDisplay : [];
    dispatch({
      type: "SET_FIELD",
      payload: { field: "requestBody", value: updatedRequestBody },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.methodType]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack
        py="lg"
        spacing="xs"
        sx={{ borderBottom: "1px solid " + theme.colors.gray[3] }}
      >
        <TextInput
          label="Description"
          placeholder="Add a new user"
          value={state.description || ""}
          onChange={(event) => {
            handleInputChange(
              "description",
              event.currentTarget.value as string
            );
          }}
        />
        <Flex gap="md">
          <Select
            label="Method Type"
            placeholder="Add a new user"
            data={MethodTypeArray}
            value={state.methodType}
            onChange={(value) => {
              handleInputChange("methodType", value as MethodTypes);
            }}
            sx={{ width: 110 }}
          ></Select>
          <TextInput
            label="Relative URL"
            placeholder="v1/user"
            value={state.relativeUrl}
            onChange={(event) => {
              handleInputChange(
                "relativeUrl",
                event.currentTarget.value as string
              );
            }}
            required
            sx={{ flexGrow: 1 }}
          />
        </Flex>

        <AddNewSection apiType="header" handleAddNew={handleAddNew} />

        {state.headers.map((item, index) => (
          <Flex key={index} align="center" gap="md">
            <Select
              data={["string", "number", "boolean", "datetime"]}
              value={item.type}
              onChange={(value) =>
                handleArrayChange(index, "type", value, "header")
              }
              sx={{ width: 110 }}
            />
            <TextInput
              size="sm"
              placeholder="name"
              value={item.name}
              onChange={(event) =>
                handleArrayChange(
                  index,
                  "name",
                  event.currentTarget.value,
                  "header"
                )
              }
              required
            ></TextInput>
            <TextInput
              placeholder="A dynamic value replaced in your app"
              value={item.value || ""}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <Tooltip label="Delete">
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                onClick={() => handleDelete(index, "header")}
              >
                <Icon name="IconTrash" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ))}

        <AddNewSection apiType="parameter" handleAddNew={handleAddNew} />

        {state.parameters.map((item, index) => (
          <Flex key={index} align="center" gap="md">
            <Select
              data={["Query", "Path", "Header", "Cookie"]}
              value={item.location}
              onChange={(value) =>
                handleArrayChange(index, "location", value, "parameter")
              }
              sx={{ width: 110 }}
            />

            <TextInput
              size="sm"
              placeholder="name"
              value={item.name}
              onChange={(event) => {
                handleArrayChange(
                  index,
                  "name",
                  event.currentTarget.value,
                  "parameter"
                );
              }}
              required
            ></TextInput>
            <TextInput
              placeholder="a dynamic value replaced in your app"
              value={""}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <Tooltip label="Delete">
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                onClick={() => handleDelete(index, "parameter")}
              >
                <Icon name="IconTrash" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ))}

        {showRequestBody && (
          <AddNewSection apiType="body" handleAddNew={handleAddNew} />
        )}

        {state.requestBody.map((item, index) => (
          <Flex key={index} align="center" gap="md">
            <Select
              data={["string", "number", "boolean", "datetime"]}
              value={item.type}
              onChange={(value) =>
                handleArrayChange(index, "type", value, "body")
              }
              sx={{ width: 110 }}
            />
            <TextInput
              size="sm"
              placeholder="name"
              value={item.name}
              onChange={(event) =>
                handleArrayChange(
                  index,
                  "name",
                  event.currentTarget.value,
                  "body"
                )
              }
              required
            ></TextInput>
            <TextInput
              placeholder="A dynamic value replaced in your app"
              value={item.value || ""}
              disabled
              sx={{ flexGrow: 1 }}
            />
            <Tooltip label="Delete">
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                onClick={() => handleDelete(index, "body")}
              >
                <Icon name="IconTrash" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        ))}
        <Tabs defaultValue="example" py="md">
          <Tabs.List>
            <Tabs.Tab value="example">Example Response</Tabs.Tab>
            <Tabs.Tab value="actual" disabled>
              Actual Response
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="example" pt="xs">
            {/* {endpoint.exampleResponse ? (
              <Prism language="json">
                {JSON.stringify(JSON.parse(endpoint.exampleResponse), null, 2)}
              </Prism>
            ) : ( */}
            <Editor
              height={endpoint.exampleResponse ? "250px" : "100px"}
              defaultLanguage="json"
              value={
                state.exampleResponse ? JSON.parse(state.exampleResponse) : ""
              }
              onChange={(value) => {
                debouncedInputChange(
                  "exampleResponse",
                  JSON.stringify(value) as string
                );
              }}
              options={{
                wordWrap: "on",
                scrollBeyondLastLine: false,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </Tabs.Panel>
        </Tabs>
        <Group>
          <Button type="submit">Save Endpoint</Button>
        </Group>
      </Stack>
    </form>
  );
};

type AddNewSectionProps = {
  apiType: ApiType;
  handleAddNew: (apiType: ApiType) => void;
};

const AddNewSection = ({ apiType, handleAddNew }: AddNewSectionProps) => (
  <Flex align="center" gap="sm">
    <Tooltip label={`Add new ${apiType}`}>
      <ActionIcon
        variant="filled"
        radius="xl"
        color="indigo"
        onClick={() => handleAddNew(apiType)}
      >
        <Icon name="IconPlus" />
      </ActionIcon>
    </Tooltip>
    <Title order={6}>{getTitle({ apiType })}</Title>
  </Flex>
);
