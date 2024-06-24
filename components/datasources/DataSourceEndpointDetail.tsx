import { WarningAlert } from "@/components/Alerts";
import { Icon } from "@/components/Icon";
import {
  createDataSourceEndpoint,
  deleteDataSourceEndpoint,
  updateDataSourceEndpoint,
} from "@/requests/datasources/mutations";
import {
  ApiEndpointFromAI,
  Endpoint,
  EndpointParams,
  Header,
  MediaTypes,
  Parameter,
  RequestBody,
  defaultApiRequest,
} from "@/requests/datasources/types";
import { MethodTypes } from "@/requests/types";
import { useAppStore } from "@/stores/app";
import { BORDER_COLOR } from "@/utils/branding";
import { ICON_DELETE } from "@/utils/config";
import { ApiType } from "@/types/dashboardTypes";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Tabs,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import debounce from "lodash.debounce";
import { useEffect, useReducer, useState } from "react";
import { MonacoEditorJson } from "../MonacoEditorJson";
import {
  extractPagingFromSupabase,
  safeJsonParse,
  toBase64,
} from "@/utils/common";
import { AddRequestInput } from "./AddRequestInput";
import { useEndpoints } from "@/hooks/editor/reactQuery/useDataSourcesEndpoints";
import {
  constructHeaders,
  performFetch,
  prepareRequestData,
} from "@/utils/actionsApi";
import { readDataFromStream } from "@/utils/api";

const MethodTypeArray: MethodTypes[] = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
];

const MediaTypeArray: MediaTypes[] = [
  "application/json",
  "application/x-www-form-urlencoded",
  "application/graphql",
  "text/event-stream",
  "application/octet-stream",
  "multipart/form-data",
];
const MethodTypesWithRequestBody: MethodTypes[] = ["POST", "PATCH", "PUT"];

export function getTitle(parameter: any) {
  switch (parameter.apiType) {
    case "header":
      return "Headers";
    case "body":
      return "Body";
    default:
      return "Parameters";
  }
}

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
  | { type: "RESET"; payload: ApiEndpointFromAI }
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
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>("example");
  const [activeBodyType, setActiveBodyType] = useState<"raw" | "fields">("raw");
  const { invalidate } = useEndpoints(projectId);

  useEffect(() => {
    // Reset the state by dispatching an action or directly setting it
    dispatch({
      type: "RESET",
      payload: {
        url: endpoint.url ?? null,
        relativeUrl: endpoint.relativeUrl ?? null,
        methodType: endpoint.methodType ?? null,
        mediaType: endpoint.mediaType ?? null,
        headers: endpoint.headers ?? [],
        parameters: endpoint.parameters ?? [],
        requestBody: endpoint.requestBody ?? [],
        body: endpoint.body,
        exampleResponse: endpoint.exampleResponse ?? null,
        errorExampleResponse: endpoint.errorExampleResponse ?? null,
        withCredentials: endpoint.withCredentials ?? null,
        isServerRequest: endpoint.isServerRequest ?? null,
      },
    });
  }, [endpoint]); // The effect runs whenever `endpoint` changes

  const initialState: EndpointParams = {
    description: endpoint.description ?? null,
    methodType: endpoint.methodType ?? "GET",
    url: endpoint.url ?? "",
    relativeUrl: endpoint.relativeUrl ?? "",
    headers: endpoint.headers ?? [],
    parameters: endpoint.parameters ?? [],
    requestBody: MethodTypesWithRequestBody.includes(endpoint.methodType)
      ? endpoint.requestBody
      : [],
    body: endpoint.body ?? "",
    mediaType: endpoint.mediaType ?? "application/json",
    withCredentials: endpoint.withCredentials ?? null,
    exampleResponse: endpoint.exampleResponse ?? "",
    errorExampleResponse: endpoint.errorExampleResponse ?? "",
    isServerRequest: endpoint.isServerRequest ?? false,
    baseUrl: baseUrl,
    dataSourceId: dataSourceId,
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
      case "RESET":
        return { ...state, ...payload };
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
    const newItem = { ...defaultApiRequest[apiType], apiType };
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

      var result =
        "id" in endpoint
          ? await updateDataSourceEndpoint(
              projectId,
              dataSourceId,
              endpoint.id,
              payload,
            )
          : await createDataSourceEndpoint(projectId, dataSourceId, payload);

      invalidate();

      setEndpointDetailVisible && setEndpointDetailVisible(false);

      // @ts-ignore
      endpoint.id = result.id;

      stopLoading({
        id: "saving",
        title: "API Endpoint Saved",
        message: "The API endpoint was saved successfully",
      });
    } catch (error: any) {
      console.error(error);
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

      invalidate();
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
        headers,
        mediaType,
        withCredentials,
        parameters,
        requestBody,
        body,
      } = state;

      let { url, relativeUrl } = state;

      baseUrl = baseUrl.replace(/\/+$/, "");
      relativeUrl = relativeUrl.replace(/^\/+/, "");
      let apiUrl = url ?? `${baseUrl}/${relativeUrl}`;

      // Add query parameters if any
      if (parameters && parameters.length > 0) {
        const urlParams = new URLSearchParams();
        for (const param of parameters) {
          if (param.value !== null && param.location === "Query") {
            urlParams.append(param.name, param.value?.toString());
          }
        }
        apiUrl = `${apiUrl}?${urlParams.toString()}`;
      }

      // Prepare request headers
      const requestHeaders: Record<string, string> = {
        "Content-Type": mediaType,
        Accept: "*/*",
      };

      for (const header of headers) {
        if (header.value !== null) {
          requestHeaders[header.name] = header.value.toString();
        }
      }

      const fetchUrl = state.isServerRequest
        ? `/api/proxy?targetUrl=${toBase64(url)}`
        : apiUrl;

      const isGetMethodType = methodType === "GET";

      const _headers = constructHeaders(mediaType, requestHeaders);

      const init: RequestInit = {
        method: methodType,
        headers: _headers,
      };

      if (body && !isGetMethodType) {
        init.body = JSON.stringify(body);
      }
      const response = await fetch(fetchUrl, init);

      if (response.status.toString().startsWith("50")) {
        const result = await response.json();
        console.error(result);
        throw new Error(
          `Failed to fetch, status: ${response.status}, text: ${response.statusText}`,
        );
      }

      if (response.status.toString().startsWith("4")) {
        if (response.status === 401) {
          setWarningMessage(
            "This endpoint requires authentication. Please add authentication to your request.",
          );
        }
        setActiveTab("error");
        const result = await response.json();
        let exampleResult = result;
        const errorExampleResponse = JSON.stringify(exampleResult, null, 2);

        handleInputChange("errorExampleResponse", errorExampleResponse);
      } else {
        // If the result is an array, limit it to the first 2 items
        let result = {};

        if (response.headers.get("content-type")?.includes("application/json"))
          result = await response.json();

        // SUPABASE ONLY, NEEDS REFACTORING
        const contentRange = response.headers.get("Content-Range");

        if (contentRange && !contentRange.endsWith("/*")) {
          const pagingModel = extractPagingFromSupabase(contentRange);

          result = {
            results: result,
            paging: {
              totalRecords: pagingModel.totalRecords,
              recordsPerPage: pagingModel.recordsPerPage,
              page: pagingModel.page,
            },
          };
        }

        let exampleResult = result;
        if (Array.isArray(result)) {
          exampleResult = result.slice(0, 2);
        }

        const exampleResponse = JSON.stringify(exampleResult, null, 2);

        handleInputChange("exampleResponse", exampleResponse);
        setActiveTab("example");
        setWarningMessage(null);
      }
      stopLoading({
        id: "testing",
        title: "API Endpoint Tested",
        message: "The API endpoint works. Hit save to save the response.",
      });
    } catch (error: any) {
      console.error(error);
      if (!state.isServerRequest && !warningMessage) {
        setWarningMessage(
          "Does this API endpoint need to be made through a server? If so turn on 'Make request through server' and try again.",
        );
      }
      stopLoading({
        id: "testing",
        title: "API Endpoint Failed",
        message: error.message,
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

  useEffect(() => {
    // Check if `body` is a valid JSON string and parse it
    try {
      const bodyObj = state.body && safeJsonParse(state.body);
      const newRequestBody = Object.keys(bodyObj).map((key) => ({
        name: key,
        type: typeof bodyObj[key], // You might need a more sophisticated method to determine the type
        description: null, // Assuming you don't have descriptions in your JSON string
        value: bodyObj[key],
      }));

      // Update the `requestBody` state with the new array
      dispatch({
        type: "SET_FIELD",
        payload: { field: "requestBody", value: newRequestBody },
      });
    } catch (error) {
      // Handle error if `body` is not a valid JSON string
      console.error("Error parsing JSON body:", error);
    }
    // This effect should run every time `state.body` changes
  }, [state.body]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack
        py="lg"
        spacing="xs"
        sx={{ borderBottom: "1px solid " + BORDER_COLOR }}
      >
        <Flex gap="md">
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
            sx={{ flexGrow: 1 }}
          />
          <Select
            label="Media Type"
            placeholder="application/json"
            data={MediaTypeArray}
            value={state.mediaType || "application/json"}
            onChange={(value) => {
              handleInputChange("mediaType", value as MediaTypes);
            }}
          />
        </Flex>
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
          />
          <TextInput
            label="Relative URL"
            placeholder="v1/user"
            value={
              state.relativeUrl && state.relativeUrl.includes("/")
                ? state.relativeUrl.replace(/^\/+/, "")
                : state.relativeUrl
            }
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

        <AddRequestInput apiType="header" onClick={handleAddNew} />

        {state.headers.map((item, index) => (
          <Flex key={index} align="center" gap="md">
            {/* <TextInput
              value={toCorrectHeaderCasing(item.type)}
              onChange={(event) =>
                handleArrayChange(
                  index,
                  "type",
                  event.currentTarget.value,
                  "header"
                )
              }
              sx={{ width: 110 }}
            /> */}
            <TextInput
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
              value={item.value}
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

        <AddRequestInput apiType="parameter" onClick={handleAddNew} />

        {state.parameters.map((item, index) => (
          <Flex key={index} align="center" gap="md">
            <Select
              data={[
                { label: "Query", value: "Query" },
                { label: "Path", value: "Path" },
                { label: "Header", value: "Header" },
                { label: "Cookie", value: "Cookie" },
              ]}
              value={item.location ?? "Query"}
              onChange={(value) =>
                handleArrayChange(index, "location", value, "parameter")
              }
              sx={{ width: 110 }}
            />

            <TextInput
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
              value={item.value}
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
          <>
            <AddRequestInput
              apiType="body"
              onClick={handleAddNew}
              bodyType={activeBodyType}
            />

            <SegmentedControl
              value={activeBodyType}
              onChange={(value) => setActiveBodyType(value as "raw" | "fields")}
              data={[
                { label: "Raw Body", value: "raw" },
                { label: "Fields", value: "fields" },
              ]}
              sx={{ maxWidth: "200px" }}
            />
            {activeBodyType === "raw" && (
              <MonacoEditorJson
                value={state.body}
                onChange={(value) => {
                  debouncedInputChange("body", value);
                }}
              />
            )}
            {activeBodyType === "fields" &&
              state.requestBody &&
              state.requestBody.map((item, index) => (
                <Flex key={index} align="center" gap="md">
                  <Select
                    data={[
                      "string",
                      "number",
                      "boolean",
                      "datetime",
                      "object",
                      "array",
                      "file",
                    ]}
                    value={item.type}
                    onChange={(value) =>
                      handleArrayChange(index, "type", value, "body")
                    }
                    sx={{ width: 110 }}
                  />
                  <TextInput
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
                    value={item.value}
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
          </>
        )}

        <Tabs
          value={activeTab}
          py="md"
          keepMounted={false}
          onTabChange={setActiveTab}
        >
          <Tabs.List>
            <Tabs.Tab value="example">Example Response</Tabs.Tab>
            <Tabs.Tab value="error">Error Response</Tabs.Tab>
            <Tabs.Tab value="actual" disabled>
              Actual Response
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="example" pt="xs">
            <MonacoEditorJson
              value={state.exampleResponse}
              onChange={(value) => {
                debouncedInputChange("exampleResponse", value);
              }}
            />
          </Tabs.Panel>
          <Tabs.Panel value="error" pt="xs">
            <MonacoEditorJson
              value={state.errorExampleResponse}
              onChange={(value) => {
                debouncedInputChange("errorExampleResponse", value);
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
        {warningMessage && (
          <WarningAlert title="API Failed" text={warningMessage}></WarningAlert>
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
            variant="default"
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
