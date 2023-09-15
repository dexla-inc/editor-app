import { Icon } from "@/components/Icon";
import {
  createDataSourceEndpoint,
  deleteDataSourceEndpoint,
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
import { ICON_DELETE } from "@/utils/config";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Select,
  Stack,
  Switch,
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
import { useEffect, useReducer, useState } from "react";
import { WarningAlert } from "../Alerts";

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
    name: "",
    type: "string",
    description: null,
    value: null,
  },
  parameter: {
    location: "Query",
    required: false,
    name: "",
    type: "string",
    description: null,
    value: null,
  },
  body: {
    name: "",
    type: "string",
    description: null,
    value: null,
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
        field: keyof Header | Parameter | RequestBody;
        value: any;
        apiType: ApiType;
      };
    };

const valuePlaceholder =
  "Usually dynamic and replaced in the editor. Add to test or values that do not change";

type DataSourceEndpointDetailProps = {
  baseUrl: string;
  endpoint: Endpoint | EndpointParams;
  projectId: string;
  dataSourceId: string;
  setEndpointDetailVisible?: (visible: boolean) => void;
};

// Start of component
export const DataSourceEndpointDetail = ({
  baseUrl,
  endpoint,
  projectId,
  dataSourceId,
  setEndpointDetailVisible,
}: DataSourceEndpointDetailProps) => {
  const startLoading = useAppStore((state) => state.startLoading);
  const stopLoading = useAppStore((state) => state.stopLoading);
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const [displayIsServerRequestWarning, setDisplayIsServerRequestWarning] =
    useState(false);

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
    isServerRequest: endpoint.isServerRequest ?? false,
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
        const itemToUpdate = updatedArray[payload.index];

        // @ts-ignore
        itemToUpdate[payload.field] = payload.value;

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
    handleFieldChange(field, value);
  };
  const debouncedInputChange = debounce(handleInputChange, 300);

  const handleArrayChange = (
    index: number,
    field: keyof Header | keyof Parameter | keyof RequestBody,
    value: any,
    apiType: ApiType,
  ) => {
    dispatch({
      type: "UPDATE_ARRAY_FIELD",
      // @ts-ignore
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
      setIsLoading(true);
      startLoading({
        id: "saving",
        title: "Updating API Endpoint",
        message: "Wait while your API endpoint is being saved",
      });

      form.validate();

      "id" in endpoint
        ? await updateDataSourceEndpoint(
            projectId,
            dataSourceId,
            endpoint.id,
            payload,
          )
        : await createDataSourceEndpoint(projectId, dataSourceId, payload);

      queryClient.refetchQueries(["endpoints"]);
      setEndpointDetailVisible && setEndpointDetailVisible(false);

      stopLoading({
        id: "saving",
        title: "API Endpoint Saved",
        message: "The API endpoint was saved successfully",
      });
    } catch (error: any) {
      console.log(error);
      stopLoading({
        id: "saving",
        title: "API Endpoint Failed",
        message: error,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEndpoint = async () => {
    try {
      setIsLoading(true);
      startLoading({
        id: "deleting",
        title: "Deleting API Endpoint",
        message: "Wait while your API Endpoint is being deleted",
      });

      if ("id" in endpoint) {
        await deleteDataSourceEndpoint(projectId, dataSourceId, endpoint.id);
      }

      queryClient.refetchQueries(["endpoints"]);
      setEndpointDetailVisible && setEndpointDetailVisible(false);

      stopLoading({
        id: "deleting",
        title: "API Endpoint Deleted",
        message: "The API endpoint was deleted successfully",
      });
    } catch (error: any) {
      stopLoading({
        id: "deleting",
        title: "Delete Failed",
        message: error,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEndpoint = async () => {
    try {
      setIsLoading(true);
      startLoading({
        id: "testing",
        title: "Testing API Endpoint",
        message: "Wait while your API endpoint is being tested",
      });
      const {
        methodType,
        relativeUrl,
        headers,
        mediaType,
        withCredentials,
        parameters,
      } = state;

      let apiUrl = `${baseUrl}/${relativeUrl}`;

      // Add query parameters if any
      if (parameters && parameters.length > 0) {
        const urlParams = new URLSearchParams();
        for (const param of parameters) {
          if (param.value !== null && param.location === "Query") {
            urlParams.append(param.name, param.value.toString());
          }
        }
        apiUrl = `${apiUrl}?${urlParams.toString()}`;
      }

      // Prepare request headers
      const requestHeaders: Record<string, string> = {
        "Content-Type": mediaType,
      };

      for (const header of headers) {
        if (header.value !== null) {
          requestHeaders[header.name] = header.value.toString();
        }
      }

      // Use the Next.js API route as a proxy if isServerRequest is true
      const fetchUrl = state.isServerRequest
        ? `/api/proxy?targetUrl=${encodeURIComponent(apiUrl)}`
        : apiUrl;

      const response = await fetch(fetchUrl, {
        method: methodType,
        headers: requestHeaders,
        ...(withCredentials ? { credentials: "include" } : {}),
      });

      if (!response.status.toString().startsWith("20")) {
        throw new Error(
          `Failed to fetch, status: ${response.status}, text: ${response.statusText}`,
        );
      }

      const result = await response.json();

      handleInputChange(
        "exampleResponse",
        JSON.stringify(JSON.stringify(result, null, 2)),
      );
      setDisplayIsServerRequestWarning(false);
      stopLoading({
        id: "testing",
        title: "API Endpoint Tested",
        message: "The API endpoint works",
      });
    } catch (error: any) {
      console.log(error);
      if (!state.isServerRequest) {
        setDisplayIsServerRequestWarning(true);
      }
      stopLoading({
        id: "tested",
        title: "API Endpoint Failed",
        message: error,
        isError: true,
      });
    } finally {
      setIsLoading(false);
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
              event.currentTarget.value as string,
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
                event.currentTarget.value as string,
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
                  "header",
                )
              }
              required
            ></TextInput>
            <TextInput
              placeholder={valuePlaceholder}
              value={item.value || ""}
              onChange={(event) =>
                handleArrayChange(
                  index,
                  "value",
                  event.currentTarget.value,
                  "header",
                )
              }
              sx={{ flexGrow: 1 }}
            />
            <Tooltip label="Delete">
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                onClick={() => handleDelete(index, "header")}
              >
                <Icon name={ICON_DELETE} />
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
                  "parameter",
                );
              }}
              required
            ></TextInput>
            <TextInput
              placeholder={valuePlaceholder}
              value={item.value || ""}
              onChange={(event) =>
                handleArrayChange(
                  index,
                  "value",
                  event.currentTarget.value,
                  "parameter",
                )
              }
              sx={{ flexGrow: 1 }}
            />
            <Tooltip label="Delete">
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                onClick={() => handleDelete(index, "parameter")}
              >
                <Icon name={ICON_DELETE} />
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
                  "body",
                )
              }
              required
            ></TextInput>
            <TextInput
              placeholder={valuePlaceholder}
              value={item.value || ""}
              onChange={(event) =>
                handleArrayChange(
                  index,
                  "value",
                  event.currentTarget.value,
                  "body",
                )
              }
              sx={{ flexGrow: 1 }}
            />
            <Tooltip label="Delete">
              <ActionIcon
                variant="filled"
                radius="xl"
                color="red"
                onClick={() => handleDelete(index, "body")}
              >
                <Icon name={ICON_DELETE} />
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
            <Editor
              height={endpoint.exampleResponse ? "250px" : "100px"}
              defaultLanguage="json"
              value={
                state.exampleResponse ? JSON.parse(state.exampleResponse) : ""
              }
              onChange={(value) => {
                debouncedInputChange(
                  "exampleResponse",
                  JSON.stringify(value) as string,
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

        <Switch
          label="Make request through server"
          checked={state.isServerRequest}
          onChange={(event) => {
            debouncedInputChange(
              "isServerRequest",
              event.currentTarget.checked as boolean,
            );
          }}
        />
        <Switch
          label="With credentials"
          checked={state.withCredentials ?? false}
          onChange={(event) => {
            debouncedInputChange(
              "withCredentials",
              event.currentTarget.checked as boolean,
            );
          }}
        />
        {displayIsServerRequestWarning && (
          <WarningAlert
            title="API Failed"
            text="Does this API endpoint need to be made through a server? If so turn on 'Make request through server' and try again."
          ></WarningAlert>
        )}
        <Group mt="xl">
          <Button
            type="submit"
            leftIcon={<Icon name="IconCheck"></Icon>}
            loading={isLoading}
          >
            Save
          </Button>

          <Button
            onClick={handleTestEndpoint}
            color="indigo"
            leftIcon={<Icon name="IconClick"></Icon>}
            loading={isLoading}
          >
            Test
          </Button>
          <Button
            onClick={handleDeleteEndpoint}
            color="red"
            leftIcon={<Icon name={ICON_DELETE}></Icon>}
            loading={isLoading}
          >
            Delete
          </Button>
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
