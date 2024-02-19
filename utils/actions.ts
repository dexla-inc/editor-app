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
import { GetValueProps } from "@/contexts/DataProvider";
import { getDataSourceEndpoints } from "@/requests/datasources/queries-noauth";
import { PageResponse } from "@/requests/pages/types";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { readDataFromStream } from "@/utils/api";
import { Component, getComponentById } from "@/utils/editor";
import { executeFlow } from "@/utils/logicFlows";
import { UseFormReturnType } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { Router } from "next/router";
import { getComponentInitialDisplayValue, safeJsonParse } from "./common";
import { ValueProps } from "./types";

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
  isLogicFlow?: boolean;
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
  logicFlowId: string;
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
  value: ValueProps;
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
  setNonEditorActions: any;
  computeValue: (value: GetValueProps) => any;
  onSuccess?: Action;
  onError?: Action;
  event?: any;
  entity: Component | PageResponse;
  data?: any;
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
  const editorState = useEditorStore.getState();
  const isLive = editorState.isLive;
  const projectId = editorState.currentProjectId;

  if (!action.pageId || !action.pageSlug) {
    console.error("Page Id is not defined");
    return;
  }

  let url = isLive
    ? `/${action.pageSlug}`
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
}: GoToUrlParams) => {
  const { url, openInNewTab } = action;
  const value = computeValue({ value: url });

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
}: TogglePropsActionParams) => {
  const editorStore = useEditorStore.getState();
  const updateTreeComponent = editorStore.updateTreeComponent;
  const tree = editorStore.tree;
  const componentId = computeValue({ value: action.componentId });
  const component = getComponentById(tree.root, componentId);

  const defaultDisplayValue = getComponentInitialDisplayValue(component?.name!);

  // Determine the current display state of the component
  const currentDisplay = component?.props?.style?.display;
  const parsedCurrentDisplay = computeValue({
    value: currentDisplay,
    staticFallback: defaultDisplayValue,
  });

  // Get value to update the display to
  const newDisplay = getComponentDisplayUpdate(
    action.visibilityType,
    parsedCurrentDisplay,
    defaultDisplayValue,
    currentDisplay,
  );

  // Update the component with the new display value
  updateTreeComponent({
    componentId,
    props: {
      style: { display: newDisplay },
    },
    save: false,
  });
};

export const useShowNotificationAction = async ({
  action,
  computeValue,
}: ShowNotificationActionParams) => {
  return showNotification({
    title: computeValue({ value: action.title }),
    message: computeValue({ value: action.message }),
    color: action.color,
  });
};

export const useTriggerLogicFlowAction = (
  params: TriggerLogicFlowActionParams,
) => {
  return executeFlow(params.action.logicFlowId, params);
};

export const useChangeStateAction = ({
  action,
  computeValue,
}: ChangeStateActionParams) => {
  const componentId = computeValue({ value: action.componentId });

  const updateTreeComponentAttrs =
    useEditorStore.getState().updateTreeComponentAttrs;

  updateTreeComponentAttrs([componentId], {
    onLoad: { currentState: action.state },
  });
};

const getVariablesValue = (
  objs: Record<string, ValueProps>,
  computeValue: any,
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
  endpoint: Endpoint;
};

const getUrl = (
  keys: string[],
  apiUrl: string,
  variableValues: Record<string, string>,
) => {
  return keys.length > 0
    ? keys.reduce((url: string, key: string) => {
        const value = variableValues[key];

        if (isEmpty(value)) {
          return url;
        }

        const _url = new URL(url);
        _url.searchParams.append(key, value);
        return _url.toString();
      }, apiUrl)
    : apiUrl;
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

const handleError = async <T>(
  error: any,
  onError: Action,
  router: Router,
  rest: T,
  computeValue: (val: GetValueProps) => any,
) => {
  const errorMessage = safeJsonParse(error.message);
  const onErrorActionMapped = actionMapper[onError.action.name];

  await onErrorActionMapped.action({
    // @ts-ignore
    action: onError?.action,
    router,
    computeValue,
    ...rest,
    data: { value: errorMessage },
  });

  throw new Error(errorMessage);
};

const handleSuccess = async <T>(
  responseJson: any,
  onSuccess: Action,
  router: Router,
  rest: T,
  action: APICallAction,
  computeValue: (val: GetValueProps) => any,
) => {
  const onSuccessActionMapped = actionMapper[onSuccess.action.name];

  return onSuccessActionMapped.action({
    // @ts-ignore
    action: onSuccess?.action,
    binds: action.binds,
    router,
    computeValue,
    ...rest,
    data: responseJson,
  });
};

function constructHeaders(endpoint?: Endpoint, authHeaderKey = "") {
  const contentType = endpoint?.mediaType || "application/json";

  return {
    "Content-Type": contentType,
    ...(authHeaderKey ? { Authorization: authHeaderKey } : {}),
  };
}

// Function to perform the fetch operation
export async function performFetch(
  url: string,
  endpoint?: Endpoint,
  body?: any,
  authHeaderKey?: string,
) {
  const response = await fetch(url, {
    method: endpoint?.methodType,
    headers: constructHeaders(endpoint, authHeaderKey),
    ...(!!body ? { body: JSON.stringify(body) } : {}),
  });

  const responseString = response.status.toString();
  const handledError = responseString.startsWith("4");
  const unhandledError = responseString.startsWith("5");

  if (handledError) {
    const error = await readDataFromStream(response.body);
    throw new Error(error);
  } else if (unhandledError) {
    const error = await readDataFromStream(response.body);
    console.error(error);
    throw new Error(error);
  }

  return response.json();
}

const setLoadingState = (
  componentId: string,
  isLoading: boolean,
  updateTreeComponent: Function,
) => {
  updateTreeComponent({ componentId, props: { loading: isLoading } });
};

type ApiCallActionRestParams = Pick<
  APICallActionParams,
  "event" | "data" | "endpoint"
>;

export const useApiCallAction = async ({
  actionId,
  action,
  router,
  computeValue,
  onSuccess,
  onError,
  entity,
  ...rest
}: APICallActionParams): Promise<any> => {
  const projectId = useEditorStore.getState().currentProjectId;
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  if (entity.props) {
    setLoadingState(entity.id!, true, updateTreeComponent);
  }

  const endpoints = await getDataSourceEndpoints(projectId as string);
  const selectedEndpoint = endpoints?.results.find(
    (e) => e.id === action.endpoint,
  )!;

  try {
    const accessToken = useDataSourceStore.getState().authState.accessToken;

    const { url, body } = prepareRequestData(
      action,
      selectedEndpoint,
      computeValue,
    );

    let responseJson;

    const authHeaderKey =
      selectedEndpoint?.authenticationScheme === "BEARER"
        ? "Bearer " + accessToken
        : "";

    const fetchUrl = selectedEndpoint?.isServerRequest
      ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
      : url;

    switch (action.authType) {
      case "login":
        responseJson = await performFetch(url, selectedEndpoint, body);
        const mergedAuthConfig = { ...responseJson, ...action.authConfig };
        const setAuthTokens = useDataSourceStore.getState().setAuthTokens;

        setAuthTokens(mergedAuthConfig);
        break;
      case "logout":
        const clearAuthTokens = useDataSourceStore.getState().clearAuthTokens;

        clearAuthTokens();

        responseJson = await performFetch(
          fetchUrl,
          selectedEndpoint,
          body,
          authHeaderKey,
        );

        break;
      default:
        const refreshAccessToken =
          useDataSourceStore.getState().refreshAccessToken;

        refreshAccessToken();

        responseJson = await performFetch(
          fetchUrl,
          selectedEndpoint,
          body,
          authHeaderKey,
        );
    }

    onSuccess &&
      (await handleSuccess<ApiCallActionRestParams>(
        responseJson,
        onSuccess,
        router,
        rest,
        action,
        computeValue,
      ));

    return responseJson;
  } catch (error) {
    onError &&
      (await handleError<ApiCallActionRestParams>(
        error,
        onError,
        router,
        rest,
        computeValue,
      ));
  } finally {
    if (entity.props) {
      setLoadingState(entity.id!, false, updateTreeComponent);
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

export const useChangeVariableAction = async ({
  action,
  computeValue,
}: ChangeVariableActionParams) => {
  const setVariable = useVariableStore.getState().setVariable;
  const value = computeValue({ value: action.value });
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
