import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { ChangeLanguageActionForm } from "@/components/actions/ChangeLanguageActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { ChangeStepActionForm } from "@/components/actions/ChangeStepActionForm";
import { CustomJavascriptActionForm } from "@/components/actions/CustomJavascriptActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { OpenDrawerActionForm } from "@/components/actions/OpenDrawerActionForm";
import { OpenModalActionForm } from "@/components/actions/OpenModalActionForm";
import { OpenPopOverActionForm } from "@/components/actions/OpenPopOverActionForm";
import { ToggleAccordionItemActionForm } from "@/components/actions/ToggleAccordionItemActionForm";
import { TogglePropsActionForm } from "@/components/actions/TogglePropsActionForm";
import { TriggerLogicFlowActionForm } from "@/components/actions/TriggerLogicFlowActionForm";
import { APICallFlowActionForm } from "@/components/actions/logic-flow-forms/APICallFlowActionForm";
import { ChangeLanguageFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeLanguageActionFlowForm";
import { ChangeStateActionFlowForm } from "@/components/actions/logic-flow-forms/ChangeStateFlowActionForm";
import { ChangeStepFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeStepFlowActionForm";
import { CloseDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/CloseDrawerFlowActionForm";
import { CloseModalFlowActionForm } from "@/components/actions/logic-flow-forms/CloseModalFlowActionForm";
import { ClosePopOverFlowActionForm } from "@/components/actions/logic-flow-forms/ClosePopOverFlowActionForm";
import { CustomJavascriptFlowActionForm } from "@/components/actions/logic-flow-forms/CustomJavascriptFlowActionForm";
import { DebugFlowActionForm } from "@/components/actions/logic-flow-forms/DebugFlowActionForm";
import { transpile } from "typescript";

import { ChangeVariableActionForm } from "@/components/actions/ChangeVariableActionForm";
import { ChangeVariableFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeVariableFlowActionForm";
import { GoToUrlFlowActionForm } from "@/components/actions/logic-flow-forms/GoToUrlFlowActionForm";
import { NavigationFlowActionForm } from "@/components/actions/logic-flow-forms/NavigationFlowActionForm";
import { OpenDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/OpenDrawerFlowActionForm";
import { OpenModalFlowActionForm } from "@/components/actions/logic-flow-forms/OpenModalFlowActionForm";
import { OpenPopOverFlowActionForm } from "@/components/actions/logic-flow-forms/OpenPopOverFlowActionForm";
import { ShowNotificationFlowActionForm } from "@/components/actions/logic-flow-forms/ShowNotificationFlowActionForm";
import { TogglePropsFlowActionForm } from "@/components/actions/logic-flow-forms/TogglePropsFlowActionForm";
import { TriggerLogicFlowActionForm as TriggerLogicFlowForm } from "@/components/actions/logic-flow-forms/TriggerLogicFlowActionForm";
import {
  DataSourceAuthResponse,
  DataSourceResponse,
  Endpoint,
} from "@/requests/datasources/types";

import { ShowNotificationActionForm } from "@/components/actions/ShowNotificationActionForm";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { readDataFromStream } from "@/utils/api";
import { Component, getComponentById } from "@/utils/editor";
import { flattenKeys } from "@/utils/flattenKeys";
import { executeFlow } from "@/utils/logicFlows";
import { showNotification } from "@mantine/notifications";
import get from "lodash.get";
import merge from "lodash.merge";
import { Router } from "next/router";
import { getComponentInitialDisplayValue } from "./common";
import { BindingType, ValueProps } from "./types";
import { useDataContext } from "@/contexts/DataProvider";

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
  { name: "changeStep", group: "Z Delete", icon: "IconStatusChange" },
  {
    name: "toggleAccordionItem",
    group: "Z Delete",
    icon: "IconStatusChange",
  },
  { name: "openDrawer", group: "Z Delete" },
  { name: "closeDrawer", group: "Z Delete" },
  { name: "openModal", group: "Z Delete" },
  { name: "closeModal", group: "Z Delete" },
  { name: "openPopOver", group: "Z Delete" },
  { name: "closePopOver", group: "Z Delete" },
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
  actionCode?: Record<string, string>;
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

export interface OpenModalAction extends BaseAction {
  name: "openModal";
  modalId: string;
}

export interface ToggleAccordionItemAction extends BaseAction {
  name: "openModal";
  accordionId: string;
  accordionItemId: string;
}

export interface OpenDrawerAction extends BaseAction {
  name: "openDrawer";
  drawerId: string;
}

export interface TriggerLogicFlowAction extends BaseAction {
  name: "triggerLogicFlow";
  logicFlowId: string;
}

export interface OpenPopOverAction extends BaseAction {
  name: "openPopOver";
  popOverId: string;
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
  conditionRules: Array<{
    condition: string;
    componentId: ValueProps;
    state: string;
  }>;
}

export type EndpointAuthType = "authenticated" | "login" | "logout";

export interface APICallAction extends BaseAction {
  name: "apiCall";
  endpoint: string;
  selectedEndpoint: Endpoint;
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

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action:
    | NavigationAction
    | AlertAction
    | APICallAction
    | GoToUrlAction
    | OpenModalAction
    | OpenDrawerAction
    | OpenPopOverAction
    | ToggleAccordionItemAction
    | TogglePropsAction
    | ShowNotificationAction
    | ChangeStateAction
    | ToggleNavbarAction
    | ChangeStepAction
    | TriggerLogicFlowAction
    | ChangeLanguageAction
    | ChangeVariableAction;
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

export type OpenModalActionParams = ActionParams & {
  action: OpenModalAction;
};

export type OpenDrawerActionParams = ActionParams & {
  action: OpenDrawerAction;
};

export type ToggleAccordionItemActionParams = ActionParams & {
  action: ToggleAccordionItemAction;
};

export type TriggerLogicFlowActionParams = ActionParams & {
  action: TriggerLogicFlowAction;
};

export type OpenPopOverActionParams = ActionParams & {
  action: OpenPopOverAction;
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
export type ChangeStepActionParams = ActionParams & {
  action: ChangeStepAction;
};

export type ChangeLanguageActionParams = ActionParams & {
  action: ChangeLanguageAction;
};

export const useOpenModalAction =
  () =>
  ({ action }: OpenModalActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    updateTreeComponent({
      componentId: action.modalId,
      props: { opened: true },
      save: false,
    });
  };

export const useCloseModalAction =
  () =>
  ({ action }: OpenModalActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    updateTreeComponent({
      componentId: action.modalId,
      props: { opened: false },
      save: false,
    });
  };

export const useOpenDrawerAction =
  () =>
  ({ action }: OpenDrawerActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    updateTreeComponent({
      componentId: action.drawerId,
      props: { opened: true },
      save: false,
    });
  };

export const useToggleAccordionItemAction =
  () =>
  ({ action }: ToggleAccordionItemActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    const editorTree = useEditorStore.getState().tree;

    const accordion = getComponentById(editorTree.root, action.accordionId);

    updateTreeComponent({
      componentId: action.accordionId,
      props: {
        value:
          accordion?.props?.value === action.accordionItemId
            ? ""
            : action.accordionItemId,
      },
      save: false,
    });
  };

export const useCloseDrawerAction =
  () =>
  ({ action }: OpenDrawerActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    updateTreeComponent({
      componentId: action.drawerId,
      props: { opened: false },
      save: false,
    });
  };

export const useOpenPopOverAction =
  () =>
  ({ action }: OpenPopOverActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    updateTreeComponent({
      componentId: action.popOverId,
      props: { opened: true },
      save: false,
    });
  };

export const useClosePopOverAction =
  () =>
  ({ action }: OpenPopOverActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
    updateTreeComponent({
      componentId: action.popOverId,
      props: { opened: false },
      save: false,
    });
  };

export const useChangeStepAction = () => {
  return ({ action }: ChangeStepActionParams) => {
    const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

    const component = getComponentById(
      useEditorStore.getState().tree.root,
      action.stepperId,
    );

    if (!component) {
      return;
    }

    let { activeStep } = component.props!;
    activeStep = Number(activeStep);

    if (action.control === "previous" && activeStep > 0) {
      activeStep -= 1;
    } else if (
      action.control === "next" &&
      activeStep < component!.children!.length - 1
    ) {
      activeStep += 1;
    }

    updateTreeComponent({
      componentId: action.stepperId,
      props: { activeStep },
      save: false,
    });
  };
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

const getVariableValueFromVariableId = (variableId = "") => {
  const variableList = useVariableStore.getState().variableList;
  const actionVariable = variableId.split("var_")[1];

  if (!actionVariable) {
    return variableId;
  }

  let _var: string | { id: string; path: string } = actionVariable;
  if (actionVariable.startsWith("{") && actionVariable.endsWith("}")) {
    _var = JSON.parse(actionVariable);
  }

  const isObject = typeof _var === "object";

  if (_var) {
    const variableId = isObject ? (_var as any).id : _var;
    const variable = variableList.find(
      (v) => v.id === variableId || v.name === variableId,
    );

    if (!variable) return;
    let value = variable.defaultValue;
    if (isObject) {
      const dataFlatten = flattenKeys(
        JSON.parse(variable.defaultValue ?? "{}"),
      );

      value = get(dataFlatten, (_var as any).path);
    }
    return value;
  }
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
  return ({ action, event }: ChangeStateActionParams) => {
    const setTreeComponentCurrentState =
      useEditorStore.getState().setTreeComponentCurrentState;
    const skipPreviousList: string[] = [];
    (action.conditionRules || []).forEach((item) => {
      const componentId = computeValue({ value: item.componentId });
      if (!skipPreviousList.includes(componentId)) {
        if (item.condition === event || item.condition === "") {
          setTreeComponentCurrentState(componentId, item.state);
          skipPreviousList.push(componentId);
        }
        console.error(
          "Condition not met changeStateAction",
          item.condition,
          event,
        );
      }
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

function getElementValue(value: string): string {
  const currentDocument = getCurrentDocument();
  const _id = value.split("valueOf_")[1];
  let el = currentDocument?.getElementById(_id);
  const tag = el?.tagName?.toLowerCase();

  if (tag !== "input") {
    el = el?.getElementsByTagName("input")[0];
  }

  if (!el) {
    const component = getComponentById(
      useEditorStore.getState().tree.root,
      _id,
    );

    if (component && component.props) {
      return component?.props?.value?.toString() ?? "";
    }
  }

  return (el as HTMLInputElement)?.value ?? "";
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
    // TODO: remove this code
    // let value = key;

    // if (key.startsWith(`valueOf_`)) {
    //   value = getElementValue(key);
    // } else if (key?.startsWith(`queryString_pass_`)) {
    //   value = getQueryElementValue(key);
    // } else if (key.startsWith(`var_`)) {
    //   value = getVariableValueFromVariableId(key) as string;
    // } else if (key.startsWith(`auth_`)) {
    //   value = getAuthValueFromAuthId(key) as string;
    // }

    const fieldValue = computeValue({ value });

    if (fieldValue) {
      // @ts-ignore
      acc[key] = fieldValue;
    }

    return acc;
  }, {});
};

function getAuthValueFromAuthId(authId: string) {
  const getAuthState = useDataSourceStore.getState().getAuthState;
  const authState = getAuthState();
  const key = authId.split("auth_")[1];
  // @ts-ignore
  return authState[key];
}

export type APICallActionParams = ActionParams & {
  action: APICallAction;
  endpoint: Endpoint;
};

const getUrl = (
  keys: string[],
  apiUrl: string,
  action: any,
  variableValues: any,
) => {
  return keys.length > 0
    ? keys.reduce((url: string, key: string) => {
        key.startsWith("type_Key_") ? (key = key.split(`type_key_`)[1]) : key;
        let value = action.binds?.parameter[key] as string;

        if (!value) {
          return url.toString();
        }

        value = variableValues[value] ?? "";

        if (!url.includes(`{${key}}`)) {
          const _url = new URL(url);
          _url.searchParams.append(key, value);
          return _url.toString();
        } else {
          return url.replace(`{${key}}`, value);
        }
      }, apiUrl)
    : apiUrl;
};

const getBody = (endpoint: Endpoint, action: any, variableValues: any) => {
  return endpoint?.methodType === "POST" ? variableValues : undefined;
};

export const prepareRequestData = (
  action: any,
  endpoint: Endpoint,
  computeValue: any,
) => {
  if (!endpoint) {
    return { url: "", body: {} };
  }

  const keys = action.binds?.parameter && Object.keys(action.binds?.parameter);
  const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;

  const variableValues = getVariablesValue(
    merge(action.binds?.body ?? {}, action.binds?.parameter ?? {}),
    computeValue,
  );

  const url = getUrl(keys ?? [], apiUrl, action, variableValues);
  const body = getBody(endpoint, action, variableValues);
  return { url, body };
};

const handleError = async (
  error: any,
  onError: any,
  actionId: any,
  router: any,
  rest: any,
  component: any,
  actionMapper: any,
  updateTreeComponent: any,
) => {
  if (onError && onError.sequentialTo === actionId) {
    const actions = component.actions ?? [];
    const onErrorAction = actions.find((a: Action) => a.trigger === "onError");
    const onErrorActionMapped = actionMapper[onError.action.name].action();
    let errorMessage = "";

    try {
      errorMessage = JSON.parse(error.message);
    } catch {
      errorMessage = error.message;
    }

    onErrorActionMapped({
      action: onErrorAction?.action,
      router,
      ...rest,
      data: { value: errorMessage },
    });
  }

  updateTreeComponent(component.id!, { loading: false }, false);
};

const handleSuccess = async (
  responseJson: any,
  onSuccess: any,
  actionId: any,
  router: any,
  rest: any,
  component: any,
  action: any,
  actionMapper: any,
  updateTreeComponent: any,
) => {
  if (onSuccess && onSuccess.sequentialTo === actionId) {
    const actions = component.actions ?? [];
    const onSuccessAction = actions.find(
      (a: Action) => a.trigger === "onSuccess",
    );
    const onSuccessActionMapped = actionMapper[onSuccess.action.name];

    onSuccessActionMapped.action({
      action: onSuccessAction?.action,
      binds: action.binds,
      router,
      ...rest,
      data: responseJson,
    });
  }

  updateTreeComponent(component.id!, { loading: false }, false);
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

export const useApiCallAction = () => {
  const { computeValue } = useDataContext()!;

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

    try {
      setLoadingState(component.id!, true, updateTreeComponent);
      const accessToken = useDataSourceStore.getState().authState.accessToken;

      const { url, body } = prepareRequestData(
        action,
        action.selectedEndpoint,
        computeValue,
      );

      let responseJson;

      const authHeaderKey =
        action.selectedEndpoint?.authenticationScheme === "BEARER"
          ? "Bearer " + accessToken
          : "";

      const fetchUrl = action.selectedEndpoint?.isServerRequest
        ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
        : url;

      switch (action.authType) {
        case "login":
          responseJson = await performFetch(url, action.selectedEndpoint, body);
          const mergedAuthConfig = { ...responseJson, ...action.authConfig };
          const setAuthTokens = useDataSourceStore.getState().setAuthTokens;

          setAuthTokens(mergedAuthConfig);
          break;
        case "logout":
          responseJson = await performFetch(
            fetchUrl,
            action.selectedEndpoint,
            body,
            authHeaderKey,
          );

          const clearAuthTokens = useDataSourceStore.getState().clearAuthTokens;

          clearAuthTokens();
          break;
        default:
          const refreshAccessToken =
            useDataSourceStore.getState().refreshAccessToken;

          refreshAccessToken();

          responseJson = await performFetch(
            fetchUrl,
            action.selectedEndpoint,
            body,
            authHeaderKey,
          );
      }

      await handleSuccess(
        responseJson,
        onSuccess,
        actionId,
        router,
        rest,
        component,
        action,
        actionMapper,
        updateTreeComponent,
      );
    } catch (error) {
      await handleError(
        error,
        onError,
        actionId,
        router,
        rest,
        component,
        actionMapper,
        updateTreeComponent,
      );
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
        defaultValue: value,
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
  openModal: {
    action: useOpenModalAction,
    form: OpenModalActionForm,
    flowForm: OpenModalFlowActionForm,
  },
  closeModal: {
    action: useCloseModalAction,
    form: OpenModalActionForm,
    flowForm: CloseModalFlowActionForm,
  },
  openDrawer: {
    action: useOpenDrawerAction,
    form: OpenDrawerActionForm,
    flowForm: OpenDrawerFlowActionForm,
  },
  triggerLogicFlow: {
    action: useTriggerLogicFlowAction,
    form: TriggerLogicFlowActionForm,
    flowForm: TriggerLogicFlowForm,
  },
  closeDrawer: {
    action: useCloseDrawerAction,
    form: OpenDrawerActionForm,
    flowForm: CloseDrawerFlowActionForm,
  },
  openPopOver: {
    action: useOpenPopOverAction,
    form: OpenPopOverActionForm,
    flowForm: OpenPopOverFlowActionForm,
  },
  closePopOver: {
    action: useClosePopOverAction,
    form: OpenPopOverActionForm,
    flowForm: ClosePopOverFlowActionForm,
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
  toggleAccordionItem: {
    action: useToggleAccordionItemAction,
    form: ToggleAccordionItemActionForm,
  },
  toggleNavbar: {
    action: useToggleNavbarAction,
    form: TogglePropsActionForm,
    flowForm: TogglePropsFlowActionForm,
  },
  changeStep: {
    action: useChangeStepAction,
    form: ChangeStepActionForm,
    flowForm: ChangeStepFlowActionForm,
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
