import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { ChangeLanguageActionForm } from "@/components/actions/ChangeLanguageActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { CustomJavascriptActionForm } from "@/components/actions/CustomJavascriptActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { TogglePropsActionForm } from "@/components/actions/TogglePropsActionForm";
import { TriggerLogicFlowActionForm } from "@/components/actions/TriggerLogicFlowActionForm";
import { APICallFlowActionForm } from "@/components/actions/logic-flow-forms/APICallFlowActionForm";
import { ChangeLanguageFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeLanguageActionFlowForm";
import { ChangeStateActionFlowForm } from "@/components/actions/logic-flow-forms/ChangeStateFlowActionForm";
import { CustomJavascriptFlowActionForm } from "@/components/actions/logic-flow-forms/CustomJavascriptFlowActionForm";
import { DebugFlowActionForm } from "@/components/actions/logic-flow-forms/DebugFlowActionForm";
import { transpile } from "typescript";

import { ChangeVariableActionForm } from "@/components/actions/ChangeVariableActionForm";
import { ChangeVariableFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeVariableFlowActionForm";
import { GoToUrlFlowActionForm } from "@/components/actions/logic-flow-forms/GoToUrlFlowActionForm";
import { NavigationFlowActionForm } from "@/components/actions/logic-flow-forms/NavigationFlowActionForm";
import { ShowNotificationFlowActionForm } from "@/components/actions/logic-flow-forms/ShowNotificationFlowActionForm";
import { TogglePropsFlowActionForm } from "@/components/actions/logic-flow-forms/TogglePropsFlowActionForm";
import { TriggerLogicFlowActionForm as TriggerLogicFlowForm } from "@/components/actions/logic-flow-forms/TriggerLogicFlowActionForm";
import {
  DataSourceAuthResponse,
  DataSourceResponse,
  Endpoint,
} from "@/requests/datasources/types";

import { ShowNotificationActionForm } from "@/components/actions/ShowNotificationActionForm";
import { useDataContext } from "@/contexts/DataProvider";
import { useDataSourceEndpoints } from "@/hooks/reactQuery/useDataSourceEndpoints";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { readDataFromStream } from "@/utils/api";
import { Component, getComponentById } from "@/utils/editor";
import { executeFlow } from "@/utils/logicFlows";
import { showNotification } from "@mantine/notifications";
import isEmpty from "lodash.isempty";
import merge from "lodash.merge";
import { pick } from "next/dist/lib/pick";
import { Router } from "next/router";
import { getComponentInitialDisplayValue } from "./common";
import { ValueProps } from "./types";

const triggers = [
  "onClick",
  "onHover",
  "onDoubleClick", // Do not think we need this, can just use onClick
  "onChange",
  "onFocus",
  "onBlur",
  "onOpen",
  "onClose",
  "onSubmit",
  "onInvalid",
  "onReset",
  "onKeyDown",
  // table actions
  "onRowClick",
  "onRowHover",
  "onRowSelect",
  "onRowExpand",
  "onSort",
  "onFilterApplied",
  "onSuccess",
  "onError",
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
  | "Third-Party Plugins"
  | "Z Delete";

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
  conditionRules: Array<{ componentId: ValueProps; condition: string }>;
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

export interface ToggleNavbarAction extends BaseAction {
  name: "toggleNavbar";
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

type ActionType =
  | NavigationAction
  | AlertAction
  | APICallAction
  | GoToUrlAction
  | TogglePropsAction
  | ShowNotificationAction
  | ChangeStateAction
  | ToggleNavbarAction
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
  onSuccess?: Action;
  onError?: Action;
  event?: any;
  component: Component;
  data?: any;
};

export type NavigationActionParams = ActionParams & {
  action: NavigationAction;
};

export type GoToUrlParams = ActionParams & {
  action: GoToUrlAction;
};

export const useNavigationAction =
  () =>
  ({ action, router }: NavigationActionParams) => {
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

export const useGoToUrlAction = () => {
  const { computeValue } = useDataContext()!;
  return async ({ action }: GoToUrlParams) => {
    const { url, openInNewTab } = action;
    const value = computeValue({ value: url });

    if (openInNewTab) {
      window.open(value, "_blank");
    } else {
      window.location.href = value;
    }
  };
};

export type DebugActionParams = ActionParams & {
  action: AlertAction;
};

export const useDebugAction =
  () =>
  async ({ action }: DebugActionParams) => {
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
export type ToggleNavbarActionParams = ActionParams & {
  action: ToggleNavbarAction;
};

export type ChangeLanguageActionParams = ActionParams & {
  action: ChangeLanguageAction;
};

export const useChangeVisibilityAction = () => {
  const { computeValue } = useDataContext()!;
  return ({ action }: TogglePropsActionParams) => {
    const editorStore = useEditorStore.getState();
    const updateTreeComponent = editorStore.updateTreeComponent;
    const tree = editorStore.tree;
    action.conditionRules.forEach((item) => {
      // Find the component to toggle visibility
      const componentId = computeValue({ value: item.componentId });
      const componentToToggle = getComponentById(tree.root, componentId);

      // Determine the current display state of the component
      const currentDisplay = componentToToggle?.props?.style?.display;

      // Toggle between 'none' and the component's initial display value
      const newDisplay =
        currentDisplay === "none"
          ? getComponentInitialDisplayValue(componentToToggle?.name ?? "")
          : "none";

      // Update the component with the new display value
      updateTreeComponent({
        componentId,
        props: {
          style: { display: newDisplay },
        },
        save: false,
      });
    });
  };
};

export const useToggleNavbarAction =
  () =>
  ({ action }: ToggleNavbarActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    const editorTree = useEditorStore.getState().tree;

    const selectedComponent = editorTree.root.children?.find(
      (tree) => tree.name === "Navbar",
    );
    const buttonComponent = selectedComponent?.children?.find(
      (tree) => tree.description === "Button to toggle Navbar",
    );
    const linksComponent = selectedComponent?.children?.find(
      (tree) => tree.description === "Container for navigation links",
    );
    const buttonIcon = buttonComponent?.children?.reduce(
      (obj, tree) => ({ ...obj, ...tree }),
      {} as Component,
    );

    const isExpanded = selectedComponent?.props?.style?.width !== "100px";
    const name = isExpanded ? "IconChevronRight" : "IconChevronLeft";
    const width = isExpanded ? "100px" : "260px";
    const flexDirection = isExpanded ? "column" : "row";
    const justifyContent = isExpanded ? "center" : "flex-start";

    updateTreeComponent({ componentId: buttonIcon?.id!, props: { name } });
    linksComponent?.children?.forEach((child) => {
      updateTreeComponent({
        componentId: child?.id as string,
        props: {
          style: { flexDirection, justifyContent },
        },
      });
    });
    updateTreeComponent({
      componentId: selectedComponent?.id!,
      props: { style: { width } },
    });
  };

export const useShowNotificationAction = () => {
  const { computeValue } = useDataContext()!;
  return async ({ action }: ShowNotificationActionParams) => {
    showNotification({
      title: computeValue({ value: action.title }),
      message: computeValue({ value: action.message }),
      color: action.color,
    });
  };
};

export const useTriggerLogicFlowAction =
  () => (params: TriggerLogicFlowActionParams) => {
    executeFlow(params.action.logicFlowId, params);
  };

export const useChangeStateAction = () => {
  const { computeValue } = useDataContext()!;
  return ({ action }: ChangeStateActionParams) => {
    const componentId = computeValue({ value: action.componentId });

    const updateTreeComponentAttrs =
      useEditorStore.getState().updateTreeComponentAttrs;

    updateTreeComponentAttrs([componentId], {
      onLoad: { currentState: action.state },
    });
  };
};

function getCurrentDocument() {
  const isLive = useEditorStore.getState().isLive;
  if (isLive) return document;

  const iframeWindow = useEditorStore.getState().iframeWindow;
  if (iframeWindow) return iframeWindow.document;

  console.error("iframe is empty", iframeWindow);
}

function getQueryElementValue(value: string): string {
  const currentDocument = getCurrentDocument();
  const el = currentDocument?.querySelector(
    `input#${value.split("queryString_pass_")[1]}`,
  ) as HTMLInputElement;
  return el?.value ?? "";
}

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
  onError: any,
  router: Router,
  rest: T,
  component: Component,
) => {
  const actions = component.actions ?? [];
  const onErrorAction = actions.find((a: Action) => a.trigger === "onError");
  let errorMessage = "";

  try {
    errorMessage = JSON.parse(error.message);
  } catch {
    errorMessage = error.message;
  }

  onError({
    action: onErrorAction?.action,
    router,
    ...rest,
    data: { value: errorMessage },
  });
};

const handleSuccess = async <T>(
  responseJson: any,
  onSuccess: any,
  router: Router,
  rest: T,
  component: Component,
  action: APICallAction,
) => {
  const actions = component.actions ?? [];
  const onSuccessAction = actions.find(
    (a: Action) => a.trigger === "onSuccess",
  );

  onSuccess({
    action: onSuccessAction?.action,
    binds: action.binds,
    router,
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

export const useApiCallAction = () => {
  const { computeValue } = useDataContext()!;
  const projectId = useEditorStore.getState().currentProjectId;
  const { data: endpoints } = useDataSourceEndpoints(projectId);

  return async ({
    actionId,
    action,
    router,
    onSuccess,
    onError,
    component,
    ...rest
  }: APICallActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    const selectedEndpoint = endpoints?.results.find(
      (e) => e.id === action.endpoint,
    )!;

    try {
      setLoadingState(component.id!, true, updateTreeComponent);
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
          component,
          action,
        ));
    } catch (error) {
      onError &&
        (await handleError<ApiCallActionRestParams>(
          error,
          onError,
          router,
          rest,
          component,
        ));
    } finally {
      setLoadingState(component.id!, false, updateTreeComponent);
    }
  };
};

export const useChangeLanguageAction =
  () =>
  ({ action }: ChangeLanguageActionParams) => {
    const setLanguage = useEditorStore.getState().setLanguage;
    setLanguage(action.language);
  };

// IMPORTANT: do not delete the variable data as it is used in the eval
export const useCustomJavascriptAction =
  () =>
  ({ action, data }: any) => {
    const codeTranspiled = transpile(action.code);
    return eval(codeTranspiled);
  };

export type ChangeVariableActionParams = ActionParams & {
  action: ChangeVariableAction;
};

export const useChangeVariableAction = () => {
  const { computeValue } = useDataContext()!;

  return async ({ action }: ChangeVariableActionParams) => {
    const setVariable = useVariableStore.getState().setVariable;
    const value = computeValue({ value: action.value });
    setVariable(
      {
        type: "TEXT",
        value: value,
      },
      action.variableId,
    );
  };
};

export const actionMapper = {
  alert: {
    action: useDebugAction,
    form: DebugActionForm,
    flowForm: DebugFlowActionForm,
  },
  changeVariable: {
    action: useChangeVariableAction,
    form: ChangeVariableActionForm,
    flowForm: ChangeVariableFlowActionForm,
  },
  navigateToPage: {
    action: useNavigationAction,
    form: NavigationActionForm,
    flowForm: NavigationFlowActionForm,
  },
  apiCall: {
    action: useApiCallAction,
    form: APICallActionForm,
    flowForm: APICallFlowActionForm,
  },
  goToUrl: {
    action: useGoToUrlAction,
    form: GoToUrlForm,
    flowForm: GoToUrlFlowActionForm,
  },
  triggerLogicFlow: {
    action: useTriggerLogicFlowAction,
    form: TriggerLogicFlowActionForm,
    flowForm: TriggerLogicFlowForm,
  },
  showNotification: {
    action: useShowNotificationAction,
    form: ShowNotificationActionForm,
    flowForm: ShowNotificationFlowActionForm,
  },
  changeState: {
    action: useChangeStateAction,
    form: ChangeStateActionForm,
    flowForm: ChangeStateActionFlowForm,
  },
  changeVisibility: {
    action: useChangeVisibilityAction,
    form: TogglePropsActionForm,
    flowForm: TogglePropsFlowActionForm,
  },
  toggleNavbar: {
    action: useToggleNavbarAction,
    form: TogglePropsActionForm,
    flowForm: TogglePropsFlowActionForm,
  },
  changeLanguage: {
    action: useChangeLanguageAction,
    form: ChangeLanguageActionForm,
    flowForm: ChangeLanguageFlowActionForm,
  },
  customJavascript: {
    action: useCustomJavascriptAction,
    form: CustomJavascriptActionForm,
    flowForm: CustomJavascriptFlowActionForm,
  },
};
