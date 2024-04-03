import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { ChangeLanguageActionForm } from "@/components/actions/ChangeLanguageActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { ChangeVisibilityActionForm } from "@/components/actions/ChangeVisibilityActionForm";
import { CustomJavascriptActionForm } from "@/components/actions/CustomJavascriptActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { TriggerLogicFlowActionForm } from "@/components/actions/TriggerLogicFlowActionForm";
import { transpile } from "typescript";
import { ChangeVariableActionForm } from "@/components/actions/ChangeVariableActionForm";
import {
  DataSourceAuthResponse,
  DataSourceResponse,
  Endpoint,
} from "@/requests/datasources/types";
import { ShowNotificationActionForm } from "@/components/actions/ShowNotificationActionForm";
import { LogicFlowResponse } from "@/requests/logicflows/types";
import { PageResponse } from "@/requests/pages/types";
import { FrontEndTypes } from "@/requests/variables/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useEditorTreeStore } from "@/stores/editorTree";
import { useVariableStore } from "@/stores/variables";
import { readDataFromStream } from "@/utils/api";
import {
  getComponentInitialDisplayValue,
  isObject,
  safeJsonParse,
} from "@/utils/common";
import { Component } from "@/utils/editor";
import { executeFlow } from "@/utils/logicFlows";
import { ArrayMethods } from "@/utils/types";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { Router } from "next/router";
import { ComputeValueProps, ValueProps } from "@/types/dataBinding";
import { PagingResponse } from "@/requests/types";

const triggers = [
  "onClick",
  "onHover",
  "onChange",
  "onFocus",
  "onBlur",
  "onOpen",
  "onClose",
  "onSubmit",
  "onInvalid",
  "onReset",
  "onKeyDown",
  "onSearchChange",
  "onItemSubmit",
  // table actions
  "onRowClick",
  "onRowHover",
  "onRowSelect",
  "onRowExpand",
  "onSort",
  "onFilterApplied",
  "onSuccess",
  "onError",
  // page actions
  "onPageLoad",
] as const;

type ActionGroup =
  | "Data & Logic"
  | "Design"
  | "Binding"
  | "Navigation"
  | "Modal & Overlays"
  | "Style & Props"
  | "Feedback"
  | "Utilities & Tools"
  | "Third-Party Plugins";

type ActionInfo = {
  name: string;
  group: ActionGroup;
  icon?: string;
};

export const actions: ActionInfo[] = [
  { name: "apiCall", group: "Data & Logic", icon: "IconApi" },
  { name: "changeVariable", group: "Data & Logic" },
  { name: "triggerLogicFlow", group: "Data & Logic", icon: "IconFlow" },
  { name: "changeState", group: "Design", icon: "IconTransform" },
  { name: "changeVisibility", group: "Design", icon: "IconEyeOff" },
  { name: "navigateToPage", group: "Navigation", icon: "IconFileInvoice" },
  { name: "goToUrl", group: "Navigation", icon: "IconLink" },
  { name: "showNotification", group: "Feedback" },
  { name: "alert", group: "Feedback", icon: "IconAlert" },
  { name: "customJavascript", group: "Utilities & Tools", icon: "IconCode" },
  { name: "copyToClipboard", group: "Utilities & Tools", icon: "IconCopy" },
  {
    name: "changeLanguage",
    group: "Utilities & Tools",
    icon: "IconMessageLanguage",
  },
];

export type ActionFormProps<T> = {
  form: UseFormReturnType<T>;
  isPageAction?: boolean;
  actionId?: string;
};

type ActionTriggerAll = (typeof triggers)[number];

export type ActionTrigger = ActionTriggerAll;
export type SequentialTrigger = Extract<
  ActionTriggerAll,
  "onSuccess" | "onError"
>;

export interface BaseAction {
  name: string;
  data?: any;
}

export interface NavigationAction extends BaseAction {
  name: "navigateToPage";
  pageId: string;
  pageSlug: string;
  queryStrings?: Record<string, string>;
  runInEditMode: boolean;
}

export interface GoToUrlAction extends BaseAction {
  name: "goToUrl";
  url: ValueProps;
  openInNewTab: boolean;
}

export interface AlertAction extends BaseAction {
  name: "alert";
  message: string;
}

export interface TriggerLogicFlowAction extends BaseAction {
  name: "triggerLogicFlow";
  // obsolete, use logicFlow instead
  logicFlowId: string;
  logicFlow: LogicFlowResponse;
}

export interface TogglePropsAction extends BaseAction {
  name: "changeVisibility";
  componentId: ValueProps;
  visibilityType: string;
}

export interface ShowNotificationAction extends BaseAction {
  name: "showNotification";
  title: ValueProps;
  message: ValueProps;
  color: string;
}

export interface ChangeStateAction extends BaseAction {
  name: "changeState";
  componentId: ValueProps;
  state: ValueProps;
}

export type EndpointAuthType = "authenticated" | "login" | "logout";

export interface APICallAction extends BaseAction {
  name: "apiCall";
  endpoint: string;
  authConfig: Omit<DataSourceAuthResponse, "type">;
  showLoader?: boolean;
  datasources: DataSourceResponse[];
  binds?: {
    header: { [key: string]: any };
    parameter: { [key: string]: any };
    body: { [key: string]: any };
  };
  authType: EndpointAuthType;
}

export interface ChangeStepAction extends BaseAction {
  name: "changeStep";
  stepperId: string;
  control: "previous" | "next";
}

export interface ChangeLanguageAction extends BaseAction {
  name: "changeLanguage";
  language: "default" | "french";
}

export interface CustomJavascriptAction extends BaseAction {
  name: "customJavascript";
  code: string;
}

export interface ChangeVariableAction extends BaseAction {
  name: "changeVariable";
  variableId: string;
  variableType: FrontEndTypes;
  value: ValueProps;
  method?: ArrayMethods;
  index?: ValueProps;
  partialUpdate?: boolean;
  path?: ValueProps;
}

export type ActionType =
  | NavigationAction
  | AlertAction
  | APICallAction
  | GoToUrlAction
  | TogglePropsAction
  | ShowNotificationAction
  | ChangeStateAction
  | TriggerLogicFlowAction
  | ChangeLanguageAction
  | ChangeVariableAction;

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action: ActionType;
  sequentialTo?: string;
};

export type ActionParams = {
  actionId: string;
  router: Router;
  setActionsResponses: any;
  actionResponses?: any;
  computeValue: ComputeValueProps;
  event?: any;
  entity: Component | PageResponse;
  data?: any;
  flowsList?: PagingResponse<LogicFlowResponse>;
};

export type NavigationActionParams = ActionParams & {
  action: NavigationAction;
};

export type GoToUrlParams = ActionParams & {
  action: GoToUrlAction;
};

export const useNavigationAction = ({
  action,
  router,
}: NavigationActionParams) => {
  const isLive = useEditorTreeStore.getState().isLive;
  const projectId = useEditorTreeStore.getState().currentProjectId;

  if (!action.pageId || !action.pageSlug) {
    console.error("Page Id is not defined");
    return;
  }

  let url = isLive
    ? `/${action.pageSlug}`.replace("//", "/")
    : `/projects/${projectId}/editor/${action.pageId}`;

  if (action.queryStrings && Object.keys(action.queryStrings).length) {
    const queryStrings = [];
    for (const key in action.queryStrings) {
      queryStrings.push(`${key}=${action.queryStrings[key]}`);
    }

    url += `?${queryStrings.join("&")}`;
  }

  router.push(url);
};

export const useGoToUrlAction = async ({
  action,
  computeValue,
  actionResponses,
}: GoToUrlParams) => {
  const { url, openInNewTab } = action;
  const value = computeValue<string>(
    { value: url },
    { actions: actionResponses },
  );

  if (openInNewTab) {
    window.open(value, "_blank");
  } else {
    window.location.href = value;
  }
};

export type DebugActionParams = ActionParams & {
  action: AlertAction;
};

export const useDebugAction = async ({ action }: DebugActionParams) => {
  alert(action.message);
};

export type TriggerLogicFlowActionParams = ActionParams & {
  action: TriggerLogicFlowAction;
};

export type ShowNotificationActionParams = ActionParams & {
  action: ShowNotificationAction;
};

export type TogglePropsActionParams = ActionParams & {
  action: TogglePropsAction;
};

export type ChangeStateActionParams = ActionParams & {
  action: ChangeStateAction;
};

export type ChangeLanguageActionParams = ActionParams & {
  action: ChangeLanguageAction;
};

const createVisibilityObject = (value: string, currentDisplay: any) => ({
  ...currentDisplay,
  dataType: "static",
  static: value,
});

const getComponentDisplayUpdate = (
  visibilityType: string,
  parsedCurrentDisplay: string,
  defaultDisplayValue: string,
  currentDisplay?: ValueProps,
) => {
  if (visibilityType === "toggle") {
    return parsedCurrentDisplay === "none"
      ? createVisibilityObject(defaultDisplayValue, currentDisplay)
      : createVisibilityObject("none", currentDisplay);
  } else return createVisibilityObject(visibilityType, currentDisplay);
};

export const useChangeVisibilityAction = ({
  action,
  computeValue,
  actionResponses,
}: TogglePropsActionParams) => {
  const updateTreeComponentAttrs = useEditorTreeStore(
    (state) => state.updateTreeComponentAttrs,
  );
  const componentId = computeValue<string>(
    { value: action.componentId },
    { actions: actionResponses },
  );
  const component = useEditorTreeStore(
    (state) => state.componentMutableAttrs[componentId],
  );

  const defaultDisplayValue = getComponentInitialDisplayValue(component?.name!);

  // Determine the current display state of the component
  const currentDisplay = component?.props?.style?.display;
  const parsedCurrentDisplay = computeValue<string>(
    {
      value: currentDisplay,
      staticFallback: defaultDisplayValue,
    },
    { actions: actionResponses },
  );

  // Get value to update the display to
  const newDisplay = getComponentDisplayUpdate(
    action.visibilityType,
    parsedCurrentDisplay,
    defaultDisplayValue,
    currentDisplay,
  );

  // Update the component with the new display value
  updateTreeComponentAttrs({
    componentIds: [componentId],
    attrs: {
      props: {
        style: { display: newDisplay },
      },
    },
    save: false,
  });
};

export const useShowNotificationAction = async ({
  action,
  computeValue,
  actionResponses,
}: ShowNotificationActionParams) => {
  return showNotification({
    title: computeValue<string>(
      { value: action.title },
      { actions: actionResponses },
    ),
    message: computeValue<string>(
      { value: action.message },
      { actions: actionResponses },
    ),
    color: action.color,
  });
};

export const useTriggerLogicFlowAction = async (
  params: TriggerLogicFlowActionParams,
) => {
  const selectedFlow = params.flowsList?.results.find(
    (flow: LogicFlowResponse) => flow.id === params.action.logicFlowId,
  );

  if (selectedFlow) {
    return executeFlow(selectedFlow, params);
  }

  return;
};

export const useChangeStateAction = ({
  action,
  computeValue,
  actionResponses,
}: ChangeStateActionParams) => {
  const componentId = computeValue<string>(
    { value: action.componentId },
    { actions: actionResponses },
  );
  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;

  updateTreeComponentAttrs({
    componentIds: [componentId],
    attrs: {
      onLoad: { currentState: action.state },
    },
  });
};

const getVariablesValue = (
  objs: Record<string, ValueProps>,
  computeValue: (props: { value: ValueProps }) => any,
) => {
  return Object.entries(objs).reduce((acc, [key, value]) => {
    const fieldValue = computeValue({ value });

    if (fieldValue) {
      // @ts-ignore
      acc[key] = fieldValue;
    }

    return acc;
  }, {});
};

export type APICallActionParams = ActionParams & {
  action: APICallAction;
  endpointResults: Endpoint[];
};

const getUrl = (
  keys: string[],
  apiUrl: string,
  variableValues: Record<string, string>,
) => {
  let updatedUrl = keys.reduce((currentUrl, key) => {
    return currentUrl.replace(`{${key}}`, variableValues[key] || "");
  }, apiUrl);

  const queryParams = keys.filter((key) => !apiUrl.includes(`{${key}}`));

  if (queryParams.length > 0) {
    const urlObject = new URL(updatedUrl);
    queryParams.forEach((key) => {
      const value = variableValues[key];
      if (value) {
        urlObject.searchParams.append(key, value);
      }
    });
    updatedUrl = urlObject.toString();
  }

  return updatedUrl;
};

export const prepareRequestData = (
  action: any,
  endpoint: Endpoint,
  computeValue: any,
) => {
  if (!endpoint) {
    return { url: "", body: {} };
  }
  const queryStringKeys = Object.keys(action.binds?.parameter ?? {});
  const bodyKeys = Object.keys(action.binds?.body ?? {});
  const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;

  const computedValues = getVariablesValue(
    merge(action.binds?.body ?? {}, action.binds?.parameter ?? {}),
    computeValue,
  );

  const url = getUrl(queryStringKeys, apiUrl, computedValues);
  const body = bodyKeys.length
    ? pick<Record<string, string>, string>(computedValues, bodyKeys)
    : undefined;

  return { url, body };
};

const handleError = async (props: APICallActionParams) => {
  const onErrorAction = props.entity.actions?.find(
    (action: Action) =>
      action.trigger === "onError" && action.sequentialTo === props.actionId,
  );

  const onErrorActionMapped =
    onErrorAction && actionMapper[onErrorAction.action.name];

  if (!onErrorActionMapped || !onErrorAction) {
    return;
  }

  await onErrorActionMapped.action({
    ...props,
    // @ts-ignore
    action: onErrorAction?.action,
    actionId: onErrorAction.id,
  });
};

const handleSuccess = async (props: APICallActionParams) => {
  const onSuccessAction = props.entity.actions?.find(
    (action: Action) =>
      action.trigger === "onSuccess" && action.sequentialTo === props.actionId,
  );

  const onSuccessActionMapped =
    onSuccessAction && actionMapper[onSuccessAction.action.name];

  if (!onSuccessActionMapped || !onSuccessAction) {
    return;
  }

  return onSuccessActionMapped.action({
    ...props,
    // @ts-ignore
    action: onSuccessAction.action,
    actionId: onSuccessAction.id,
  });
};

export function constructHeaders(endpoint?: Endpoint, authHeaderKey = "") {
  const contentType = endpoint?.mediaType || "application/json";

  const endpointHeaders = endpoint?.headers
    .filter((e) => e.name !== "Authorization")
    .reduce((acc, header) => {
      // @ts-ignore
      acc[header.name] = header.value;
      return acc;
    }, {});

  return {
    "Content-Type": contentType,
    ...endpointHeaders,
    ...(authHeaderKey ? { Authorization: authHeaderKey } : {}),
  };
}

// Function to perform the fetch operation
export async function performFetch(
  url: string,
  endpoint?: Endpoint,
  body?: any,
  authHeaderKey?: string,
  includeExampleResponse = false,
) {
  const isGetMethodType = endpoint?.methodType === "GET";

  const headers = constructHeaders(endpoint, authHeaderKey);
  const response = await fetch(url, {
    method: endpoint?.methodType,
    headers: headers,
    ...(!!body && !isGetMethodType && { body: JSON.stringify(body) }),
  });

  const responseString = response.status.toString();
  const handledError = responseString.startsWith("4");
  const unhandledError = responseString.startsWith("5");

  if (handledError) {
    if (includeExampleResponse) {
      return safeJsonParse(endpoint?.exampleResponse || "");
    }
    const error = await readDataFromStream(response.body);
    throw new Error(error);
  } else if (unhandledError) {
    const error = await readDataFromStream(response.body);
    console.error(error);
    throw new Error(error);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

const setLoadingState = (
  componentId: string,
  isLoading: boolean,
  updateTreeComponentAttrs: Function,
) => {
  updateTreeComponentAttrs({
    componentIds: [componentId],
    attrs: { props: { loading: isLoading } },
  });
};

export const useApiCallAction = async (
  props: APICallActionParams,
): Promise<any> => {
  const {
    action,
    actionId,
    computeValue,
    entity,
    endpointResults,
    setActionsResponses,
  } = props;

  const updateTreeComponentAttrs =
    useEditorTreeStore.getState().updateTreeComponentAttrs;
  const setActionsResponse = useEditorStore.getState().setActionsResponse;

  if (entity?.props && action.showLoader) {
    setLoadingState(entity.id!, true, updateTreeComponentAttrs);
  }

  const endpoint = endpointResults?.find((e) => e.id === action.endpoint)!;

  try {
    const accessToken = useDataSourceStore.getState().authState.accessToken;

    const customComputeValue = (args: { value: ValueProps }) =>
      computeValue(args, { actions: props.actionResponses });

    const { url, body } = prepareRequestData(
      action,
      endpoint,
      customComputeValue,
    );

    let responseJson: any;

    // TODO: Need to do this properly when we support more auth than bearer
    const authHeaderKey = accessToken ? "Bearer " + accessToken : "";

    const fetchUrl = endpoint?.isServerRequest
      ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
      : url;

    switch (action.authType) {
      case "login":
        responseJson = await performFetch(url, endpoint, body);
        const apiAuthConfig = useDataSourceStore.getState().apiAuthConfig;
        const authConfig =
          apiAuthConfig?.authConfigurations[endpoint.dataSourceId];
        const mergedAuthConfig = { ...responseJson, ...authConfig };
        const setAuthTokens = useDataSourceStore.getState().setAuthTokens;

        setAuthTokens(mergedAuthConfig);
        break;
      case "logout":
        responseJson = await performFetch(
          fetchUrl,
          endpoint,
          body,
          authHeaderKey,
        );

        const clearAuthTokens = useDataSourceStore.getState().clearAuthTokens;

        clearAuthTokens();

        break;
      default:
        const refreshAccessToken =
          useDataSourceStore.getState().refreshAccessToken;

        refreshAccessToken(endpoint.dataSourceId);

        responseJson = await performFetch(
          fetchUrl,
          endpoint,
          body,
          authHeaderKey,
        );
    }

    setActionsResponses(actionId, {
      success: responseJson,
    });
    setActionsResponse(actionId, {
      success: responseJson,
      list: {
        id: actionId,
        name: action.name,
        success: responseJson,
      },
    });

    await handleSuccess(props);

    return responseJson;
  } catch (error) {
    if (error instanceof Error) {
      setActionsResponses(actionId, {
        error: safeJsonParse(error.message),
      });
      setActionsResponse(actionId, {
        error: safeJsonParse(error.message),
        list: {
          id: actionId,
          name: action.name,
          error: error.message,
        },
      });
    }

    await handleError(props);
  } finally {
    if (entity.props && action.showLoader) {
      setLoadingState(entity.id!, false, updateTreeComponentAttrs);
    }
  }
};

export const useChangeLanguageAction = ({
  action,
}: ChangeLanguageActionParams) => {
  const setLanguage = useEditorStore.getState().setLanguage;
  setLanguage(action.language);
};

// IMPORTANT: do not delete the variable data as it is used in the eval
export const useCustomJavascriptAction = ({ action, data }: any) => {
  const codeTranspiled = transpile(action.code);
  return eval(codeTranspiled);
};

export type ChangeVariableActionParams = ActionParams & {
  action: ChangeVariableAction;
};

type ArrayActionsType = Partial<{
  value: Array<any>;
  newValue: any;
  index: number;
  path: string;
}>;
const arrayActions = {
  REPLACE_ALL_ITEMS: ({ newValue }: ArrayActionsType) => newValue,

  UPDATE_ONE_ITEM: ({
    value = [],
    newValue,
    index = 0,
    path,
  }: ArrayActionsType) => {
    if (!path || path === "") {
      value[index] = newValue;
    } else {
      const item = value[index];
      value[index] = !isObject(item)
        ? { [path]: newValue }
        : { ...item, [path]: newValue };
    }
    return value;
  },

  INSERT_AT_END: ({ value = [], newValue }: ArrayActionsType) => {
    value.push(newValue);
    return value;
  },

  INSERT_AT_START: ({ value = [], newValue }: ArrayActionsType) => {
    value.unshift(newValue);
    return value;
  },

  INSERT_AT_INDEX: ({ value = [], newValue, index = 0 }: ArrayActionsType) => {
    value.splice(index, 0, newValue);
    return value;
  },

  REMOVE_AT_INDEX: ({ value = [], index = 0 }: ArrayActionsType) => {
    value.splice(index, 1);
    return value;
  },

  REMOVE_AT_START: ({ value = [] }: ArrayActionsType) => {
    value.shift();
    return value;
  },

  REMOVE_AT_LAST: ({ value = [] }: ArrayActionsType) => {
    value.pop();
    return value;
  },
};

const updateVariableArray = (
  action: ChangeVariableAction,
  index: number | undefined = 0,
  newValue: any,
  path: string,
) => {
  const variable = useVariableStore
    .getState()
    .variableList.find((v) => v.id === action.variableId);

  if (!variable) {
    return;
  }

  const _value = variable.value ?? variable.defaultValue;
  let value = typeof _value === "string" ? JSON.parse(_value ?? "[]") : _value;
  newValue = typeof newValue === "string" ? JSON.parse(newValue) : newValue;

  if (action.method) {
    value = arrayActions[action.method]({ value, newValue, index, path });
  }

  return value;
};

export const useChangeVariableAction = async ({
  action,
  computeValue,
  actionResponses,
}: ChangeVariableActionParams) => {
  const setVariable = useVariableStore.getState().setVariable;
  const index = computeValue<number>({ value: action.index });
  const path = computeValue<string>({ value: action.path });
  let value = computeValue(
    { value: action.value },
    { actions: actionResponses },
  );

  if (action.variableType === "ARRAY") {
    value = updateVariableArray(action, index, value, path);
  }
  setVariable({
    id: action.variableId,
    value: value,
  });
};

export const actionMapper = {
  alert: {
    action: useDebugAction,
    form: DebugActionForm,
    defaultValues: {},
  },
  changeVariable: {
    action: useChangeVariableAction,
    form: ChangeVariableActionForm,
    defaultValues: {},
  },
  navigateToPage: {
    action: useNavigationAction,
    form: NavigationActionForm,
    defaultValues: {
      // runInEditMode: isPageAction ? false : true
      runInEditMode: true,
    },
  },
  apiCall: {
    action: useApiCallAction,
    form: APICallActionForm,
    defaultValues: {
      authConfig: useDataSourceStore.getState().apiAuthConfig,
      showLoader: true,
      datasources: [],
      binds: {
        header: {},
        parameter: {},
        body: {},
      },
      authType: "authenticated",
    },
  },
  goToUrl: {
    action: useGoToUrlAction,
    form: GoToUrlForm,
    defaultValues: {},
  },
  triggerLogicFlow: {
    action: useTriggerLogicFlowAction,
    form: TriggerLogicFlowActionForm,
    defaultValues: {},
  },
  showNotification: {
    action: useShowNotificationAction,
    form: ShowNotificationActionForm,
    defaultValues: {
      color: "Primary.6",
    },
  },
  changeState: {
    action: useChangeStateAction,
    form: ChangeStateActionForm,
    defaultValues: {},
  },
  changeVisibility: {
    action: useChangeVisibilityAction,
    form: ChangeVisibilityActionForm,
    defaultValues: {
      visibilityType: "toggle",
    },
  },
  changeLanguage: {
    action: useChangeLanguageAction,
    form: ChangeLanguageActionForm,
    defaultValues: {},
  },
  customJavascript: {
    action: useCustomJavascriptAction,
    form: CustomJavascriptActionForm,
    defaultValues: {},
  },
};
