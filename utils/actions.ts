import { transpile } from "typescript";

import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { BindPlaceDataActionForm } from "@/components/actions/BindPlaceDataActionForm";
import { BindResponseToComponentActionForm } from "@/components/actions/BindResponseToComponentActionForm";
import { BindVariableToComponentActionForm } from "@/components/actions/BindVariableToComponentActionForm";
import { ChangeLanguageActionForm } from "@/components/actions/ChangeLanguageActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { ChangeStepActionForm } from "@/components/actions/ChangeStepActionForm";
import { CustomJavascriptActionForm } from "@/components/actions/CustomJavascriptActionForm";
import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { GoToUrlForm } from "@/components/actions/GoToUrlForm";
import { LoginActionForm } from "@/components/actions/LoginActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { OpenDrawerActionForm } from "@/components/actions/OpenDrawerActionForm";
import { OpenModalActionForm } from "@/components/actions/OpenModalActionForm";
import { OpenPopOverActionForm } from "@/components/actions/OpenPopOverActionForm";
import { OpenToastActionForm } from "@/components/actions/OpenToastActionForm";
import { ReloadComponentActionForm } from "@/components/actions/ReloadComponentActionForm";
import { SetVariableActionForm } from "@/components/actions/SetVariableActionForm";
import { TogglePropsActionForm } from "@/components/actions/TogglePropsActionForm";
import { TriggerLogicFlowActionForm } from "@/components/actions/TriggerLogicFlowActionForm";
import { APICallFlowActionForm } from "@/components/actions/logic-flow-forms/APICallFlowActionForm";
import { BindPlaceDataFlowActionForm } from "@/components/actions/logic-flow-forms/BindPlaceDataFlowActionForm";
import { BindResponseToComponentFlowActionForm } from "@/components/actions/logic-flow-forms/BindResponseToComponentFlowActionForm";
import { BindVariableToComponentFlowActionForm } from "@/components/actions/logic-flow-forms/BindVariableToComponentFlowActionForm";
import { ChangeLanguageFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeLanguageActionFlowForm";
import { ChangeStateActionFlowForm } from "@/components/actions/logic-flow-forms/ChangeStateFlowActionForm";
import { ChangeStepFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeStepFlowActionForm";
import { CloseDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/CloseDrawerFlowActionForm";
import { CloseModalFlowActionForm } from "@/components/actions/logic-flow-forms/CloseModalFlowActionForm";
import { ClosePopOverFlowActionForm } from "@/components/actions/logic-flow-forms/ClosePopOverFlowActionForm";
import { CustomJavascriptFlowActionForm } from "@/components/actions/logic-flow-forms/CustomJavascriptFlowActionForm";
import { DebugFlowActionForm } from "@/components/actions/logic-flow-forms/DebugFlowActionForm";

import { TransformVariableActionForm } from "@/components/actions/TransformVariableActionForm";
import { BindVariableToChartFlowActionForm } from "@/components/actions/logic-flow-forms/BindVariableToChartFlowActionForm";
import { GoToUrlFlowActionForm } from "@/components/actions/logic-flow-forms/GoToUrlFlowActionForm";
import { LoginFlowActionForm } from "@/components/actions/logic-flow-forms/LoginFlowActionForm";
import { NavigationFlowActionForm } from "@/components/actions/logic-flow-forms/NavigationFlowActionForm";
import { OpenDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/OpenDrawerFlowActionForm";
import { OpenModalFlowActionForm } from "@/components/actions/logic-flow-forms/OpenModalFlowActionForm";
import { OpenPopOverFlowActionForm } from "@/components/actions/logic-flow-forms/OpenPopOverFlowActionForm";
import { OpenToastFlowActionForm } from "@/components/actions/logic-flow-forms/OpenToastFlowActionForm";
import { ReloadComponentFlowActionForm } from "@/components/actions/logic-flow-forms/ReloadComponentFlowActionForm";
import { SetVariableFlowActionForm } from "@/components/actions/logic-flow-forms/SetVariableFlowActionForm";
import { TogglePropsFlowActionForm } from "@/components/actions/logic-flow-forms/TogglePropsFlowActionForm";
import { TransformVariableFlowActionForm } from "@/components/actions/logic-flow-forms/TransformVariableFlowActionForm";
import { TriggerLogicFlowActionForm as TriggerLogicFlowForm } from "@/components/actions/logic-flow-forms/TriggerLogicFlowActionForm";
import { Position } from "@/components/mapper/GoogleMapPlugin";
import { Options } from "@/components/modifiers/GoogleMap";
import {
  getDataSourceAuth,
  getDataSourceEndpoints,
} from "@/requests/datasources/queries";
import { DataSourceResponse, Endpoint } from "@/requests/datasources/types";
import { createVariable, updateVariable } from "@/requests/variables/mutations";
import { getVariable } from "@/requests/variables/queries";
import { FrontEndTypes } from "@/requests/variables/types";
import { useAuthStore } from "@/stores/auth";
import { useEditorStore } from "@/stores/editor";
import { readDataFromStream } from "@/utils/api";
import {
  Component,
  getAllComponentsByName,
  getComponentById,
  getComponentParent,
} from "@/utils/editor";
import { flattenKeys, flattenKeysWithRoot } from "@/utils/flattenKeys";
import { executeFlow } from "@/utils/logicFlows";
import { showNotification } from "@mantine/notifications";
import get from "lodash.get";
import merge from "lodash.merge";
import { nanoid } from "nanoid";
import { Router } from "next/router";

const triggers = [
  "onClick",
  "onHover",
  "onDoubleClick", // Do not think we need this, can just use onClick
  "onMount",
  "onChange",
  "onFocus",
  "onBlur",
  "onOpen",
  "onClose",
  "onSubmit",
  "onInvalid",
  "onReset",
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
  | "API, Data & Logic"
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
  { name: "apiCall", group: "API, Data & Logic", icon: "IconApi" },
  { name: "login", group: "API, Data & Logic", icon: "IconLogin" },
  { name: "triggerLogicFlow", group: "API, Data & Logic", icon: "IconFlow" },
  { name: "reloadComponent", group: "API, Data & Logic", icon: "IconReload" },
  { name: "bindResponse", group: "Binding" },
  { name: "bindVariable", group: "Binding" }, // Merge bindVariable, transformVariable, setVariable and bindVariableToChart
  { name: "bindVariableToChart", group: "Binding" }, // Merge bindVariable, transformVariable, setVariable and bindVariableToChart
  { name: "setVariable", group: "Binding" }, // Merge bindVariable, transformVariable, setVariable and bindVariableToChart
  { name: "transformVariable", group: "Binding" }, // Merge bindVariable, transformVariable, setVariable and bindVariableToChart
  { name: "goToUrl", group: "Navigation", icon: "IconLink" },
  { name: "navigateToPage", group: "Navigation", icon: "IconFileInvoice" },
  { name: "changeStep", group: "Navigation", icon: "IconStatusChange" },
  { name: "openDrawer", group: "Modal & Overlays" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "closeDrawer", group: "Modal & Overlays" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "openModal", group: "Modal & Overlays" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "closeModal", group: "Modal & Overlays" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "openPopOver", group: "Modal & Overlays" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "closePopOver", group: "Modal & Overlays" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "toggleVisibility", group: "Style & Props" },
  { name: "alert", group: "Feedback", icon: "IconAlert" },
  { name: "changeState", group: "Feedback", icon: "IconTransform" },
  { name: "openToast", group: "Feedback" }, // Merge opening and closing drawers, modals, popovers, toasts into one action
  { name: "copyToClipboard", group: "Utilities & Tools", icon: "IconCopy" },
  {
    name: "changeLanguage",
    group: "Utilities & Tools",
    icon: "IconMessageLanguage",
  },
  { name: "customJavascript", group: "Utilities & Tools", icon: "IconCode" },
  { name: "bindPlaceData", group: "Third-Party Plugins", icon: "IconMap" },
  { name: "bindPlaceGeometry", group: "Third-Party Plugins", icon: "IconMap" },
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

export interface SetVariableAction extends BaseAction {
  name: "setVariable";
  variable: string;
  value?: any;
}

export interface NavigationAction extends BaseAction {
  name: "navigateToPage";
  pageId: string;
  queryStrings?: Record<string, string>;
}

export interface GoToUrlAction extends BaseAction {
  name: "goToUrl";
  url: string;
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
  name: "toggleVisibility";
  conditionRules: Array<{ componentId: string; condition: string }>;
}

export interface OpenToastAction extends BaseAction {
  name: "openToast";
  title: string;
  message: string;
}

export interface ChangeStateAction extends BaseAction {
  name: "changeState";
  conditionRules: Array<{
    condition: string;
    componentId: string;
    state: string;
  }>;
}

export interface APICallAction extends BaseAction {
  name: "apiCall";
  endpoint: string;
  showLoader?: boolean;
  datasources: DataSourceResponse[];
  binds?: {
    header: { [key: string]: any };
    parameter: { [key: string]: any };
    body: { [key: string]: any };
  };
}

export interface LoginAction extends Omit<APICallAction, "name"> {
  name: "login";
}

export interface BindPlaceDataAction extends Omit<APICallAction, "name"> {
  name: "bindPlaceData";
  componentId?: string;
}

export interface BindPlaceGeometryAction extends BaseAction {
  name: "bindPlaceGeometry";
  componentId: string;
  key?: string;
}

export interface BindResponseToComponentAction extends BaseAction {
  name: "bindResponse";
  data?: any;
  binds?: {
    component: string;
    value: string;
    example: string;
  }[];
}

export interface BindVariableToComponentAction extends BaseAction {
  name: "bindVariable";
  component: string;
  variable: string;
}

export interface BindVariableToChartAction extends BaseAction {
  name: "bindVariableToChart";
  component: string;
  series: string;
  labels: string;
}

export interface ReloadComponentAction extends BaseAction {
  name: "reloadComponent";
  componentId: string;
  onMountActionId?: string;
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

export interface TransformVariableAction extends BaseAction {
  name: "transformVariable";
  variableId: string;
  variableName: string;
  value: string;
}

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action:
    | SetVariableAction
    | NavigationAction
    | AlertAction
    | APICallAction
    | BindResponseToComponentAction
    | GoToUrlAction
    | LoginAction
    | OpenModalAction
    | OpenDrawerAction
    | OpenPopOverAction
    | TogglePropsAction
    | OpenToastAction
    | ChangeStateAction
    | ReloadComponentAction
    | ToggleNavbarAction
    | ChangeStepAction
    | BindPlaceDataAction
    | BindPlaceGeometryAction
    | TriggerLogicFlowAction
    | ChangeLanguageAction
    | BindVariableToComponentAction
    | TransformVariableAction
    | BindVariableToChartAction;
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

export const navigationAction = ({
  action,
  router,
}: NavigationActionParams) => {
  const { isLive } = useEditorStore.getState();
  const projectId = router.query.id as string;
  let url = isLive
    ? `/${action.pageId}`
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

export const goToUrlAction = async ({ action, component }: GoToUrlParams) => {
  const { url, openInNewTab } = action;
  let value = url;
  if (url.startsWith("var_")) {
    const { currentProjectId } = useEditorStore.getState();
    value = url.split("var_")[1];
    const isObj = value.startsWith("{") && value.endsWith("}");
    const variableResponse = await getVariable(
      currentProjectId!,
      isObj ? JSON.parse(value).id : value,
    );
    if (variableResponse.type === "OBJECT") {
      const variable = JSON.parse(value);
      const val = JSON.parse(
        variableResponse?.value ?? variableResponse?.defaultValue ?? "{}",
      );
      if (typeof component?.props?.repeatedIndex !== "undefined") {
        const path = (variable.path ?? "").replace(
          "[0]",
          `[${component?.props?.repeatedIndex}]`,
        );
        value = get(val ?? {}, path) ?? "";
      } else {
        value = get(val ?? {}, variable.path ?? "") ?? "";
      }
    } else {
      value = variableResponse?.value ?? variableResponse?.defaultValue ?? "";
    }
  }

  if (openInNewTab) {
    window.open(value, "_blank");
  } else {
    window.location.href = value;
  }
};

export type DebugActionParams = ActionParams & {
  action: AlertAction;
};

export const debugAction = ({ action }: DebugActionParams) => {
  alert(action.message);
};

export type SetVariableActionParams = ActionParams & {
  action: SetVariableAction;
};

export type OpenModalActionParams = ActionParams & {
  action: OpenModalAction;
};

export type OpenDrawerActionParams = ActionParams & {
  action: OpenDrawerAction;
};

export type TriggerLogicFlowActionParams = ActionParams & {
  action: TriggerLogicFlowAction;
};

export type OpenPopOverActionParams = ActionParams & {
  action: OpenPopOverAction;
};

export type OpenToastActionParams = ActionParams & {
  action: OpenToastAction;
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
export type ReloadComponentActionParams = ActionParams & {
  action: ReloadComponentAction;
};

export type BindPlaceDataActionParams = ActionParams & {
  action: BindPlaceDataAction;
};

export type BindPlaceGeometryActionParams = ActionParams & {
  action: BindPlaceGeometryAction;
};

export type ChangeLanguageActionParams = ActionParams & {
  action: ChangeLanguageAction;
};

export const openModalAction = ({ action }: OpenModalActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.modalId, { opened: true }, false);
};

export const closeModalAction = ({ action }: OpenModalActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.modalId, { opened: false }, false);
};

export const openDrawerAction = ({ action }: OpenDrawerActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.drawerId, { opened: true }, false);
};

export const closeDrawerAction = ({ action }: OpenDrawerActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.drawerId, { opened: false }, false);
};

export const openPopOverAction = ({ action }: OpenPopOverActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.popOverId, { opened: true }, false);
};

export const closePopOverAction = ({ action }: OpenPopOverActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent(action.popOverId, { opened: false }, false);
};

export const changeStepAction = ({ action }: ChangeStepActionParams) => {
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

  updateTreeComponent(action.stepperId, { activeStep }, false);
};
export const togglePropsAction = ({
  action,
  event,
}: TogglePropsActionParams) => {
  const { updateTreeComponent, tree } = useEditorStore.getState();
  let componentId = "";
  action.conditionRules.forEach((item) => {
    if (item.condition === event) {
      componentId = item.componentId;
    }

    updateTreeComponent(
      item.componentId,
      {
        style: { display: "none" },
      },
      false,
    );
  });

  updateTreeComponent(
    componentId,
    {
      style: { display: "flex" },
    },
    false,
  );
};
export const toggleNavbarAction = ({ action }: ToggleNavbarActionParams) => {
  const { updateTreeComponent, tree: editorTree } = useEditorStore.getState();
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

  const isExpanded = selectedComponent?.props?.style.width !== "100px";
  const name = isExpanded ? "IconChevronRight" : "IconChevronLeft";
  const width = isExpanded ? "100px" : "260px";
  const flexDirection = isExpanded ? "column" : "row";
  const justifyContent = isExpanded ? "center" : "flex-start";

  updateTreeComponent(buttonIcon?.id!, { name });
  linksComponent?.children?.forEach((child) => {
    updateTreeComponent(child?.id as string, {
      style: { flexDirection, justifyContent },
    });
  });
  updateTreeComponent(selectedComponent?.id!, { style: { width } });
};

const getVariableValueFromVariableId = async (variableId = "") => {
  const currentProjectId = useEditorStore.getState().currentProjectId;
  const actionVariable = variableId.split(`var_`)[1];

  if (!actionVariable) {
    return variableId;
  }

  let _var: string | { id: string; path: string } = actionVariable;
  if (actionVariable.startsWith("{") && actionVariable.endsWith("}")) {
    _var = JSON.parse(actionVariable);
  }

  const isObject = typeof _var === "object";

  if (_var) {
    const variable = await getVariable(
      currentProjectId!,
      isObject ? (_var as any).id : _var,
    );

    let value = variable.value;
    if (isObject) {
      const dataFlatten = flattenKeys(JSON.parse(variable.value ?? "{}"));

      value = get(dataFlatten, (_var as any).path);
    }

    return value;
  }
};

export const openToastAction = async ({ action }: OpenToastActionParams) => {
  showNotification({
    title: await getVariableValueFromVariableId(action.title),
    message: await getVariableValueFromVariableId(action.message),
  });
};

export const setVariableAction = async ({
  action,
  event,
}: SetVariableActionParams) => {
  let value = action.value || event.toString();

  if (value.startsWith("valueOf")) {
    value = getElementValue(value, useEditorStore.getState().iframeWindow);
  }

  const projectId = useEditorStore.getState().currentProjectId;
  const variable = JSON.parse(action.variable);
  await updateVariable(projectId!, variable.id, { ...variable, value });
};

export const triggerLogicFlowAction = (
  params: TriggerLogicFlowActionParams,
) => {
  executeFlow(params.action.logicFlowId, params);
};

export const changeStateAction = ({
  action,
  event,
}: ChangeStateActionParams) => {
  const { setTreeComponentCurrentState } = useEditorStore.getState();
  const skipPreviousList: string[] = [];
  (action.conditionRules || []).forEach((item) => {
    if (!skipPreviousList.includes(item.componentId)) {
      if (item.condition === event || item.condition === "") {
        setTreeComponentCurrentState(item.componentId, item.state);
        skipPreviousList.push(item.componentId);
      } else {
        setTreeComponentCurrentState(item.componentId, "hidden");
      }
    }
  });
};

function getElementValue(value: string, iframeWindow: any): string {
  const _id = value.split("valueOf_")[1];
  let el = iframeWindow?.document.getElementById(_id);
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

function getQueryElementValue(value: string, iframeWindow: any): string {
  const el = iframeWindow?.document.querySelector(
    `input#${value.split("queryString_pass_")[1]}`,
  ) as HTMLInputElement;
  return el?.value ?? "";
}

const getVariablesValue = async (objs: Record<string, string>) => {
  return await Object.values(objs).reduce(async (acc, key) => {
    const result = await acc;
    let value = "";
    const iframeWindow = useEditorStore.getState().iframeWindow;

    if (key.startsWith(`valueOf_`)) {
      value = getElementValue(key, iframeWindow);
    }

    if (key?.startsWith(`queryString_pass_`)) {
      value = getQueryElementValue(key, iframeWindow);
    }

    if (key.startsWith(`var_`)) {
      value = (await getVariableValueFromVariableId(key)) as string;
    }

    if (value) {
      // @ts-ignore
      result[key] = value;
    }

    return Promise.resolve(result);
  }, Promise.resolve({}));
};

export type APICallActionParams = ActionParams & {
  action: APICallAction;
};

export type LoginActionParams = ActionParams & {
  action: LoginAction;
};

let cachedEndpoints: Endpoint[] | undefined;

const getCachedEndpoint = async (projectId: string) => {
  if (!cachedEndpoints) {
    const { results } = await getDataSourceEndpoints(projectId);
    cachedEndpoints = results;
  }
  return cachedEndpoints;
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

const getBody = (endpoint: any, action: any, variableValues: any) => {
  return endpoint?.methodType === "POST"
    ? Object.keys(action.binds?.body ?? {}).reduce((body: any, key: string) => {
        let value = action.binds.body[key] as string;

        if (!value) {
          return body;
        }

        value = variableValues[value];
        return { ...body, [key]: value };
      }, {} as any)
    : undefined;
};

const prepareRequestData = async (router: any, action: any) => {
  const projectId = router.query.id as string;
  const cachedEndpoints = await getCachedEndpoint(projectId);
  const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);

  const keys = Object.keys(action.binds?.parameter ?? {});
  const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;
  const variableValues = await getVariablesValue(
    merge(action.binds?.body ?? {}, action.binds?.parameter ?? {}),
  );

  const url = getUrl(keys, apiUrl, action, variableValues);
  const body = getBody(endpoint, action, variableValues);

  return { endpoint, url, body };
};

const handleError = async (
  error: any,
  onError: any,
  actionId: any,
  router: any,
  rest: any,
  component: any,
  endpoint: any,
  actionMapper: any,
  updateTreeComponent: any,
) => {
  if (onError && onError.sequentialTo === actionId) {
    const actions = component.actions ?? [];
    const onErrorAction = actions.find((a: Action) => a.trigger === "onError");
    const onErrorActionMapped = actionMapper[onError.action.name];
    onErrorActionMapped.action({
      action: onErrorAction?.action,
      router,
      ...rest,
      data: { value: JSON.parse(error.message) },
    });
  }

  updateTreeComponent(component.id!, { loading: false }, false);

  const varName = `${endpoint?.methodType} ${endpoint?.relativeUrl}-error`;
  const varValue = JSON.stringify(JSON.parse(error.message));
  await createVariable(router.query.id as string, {
    name: varName,
    value: varValue,
    type: "OBJECT" as FrontEndTypes,
    isGlobal: false,
    pageId: router.query.page as string,
    defaultValue: varValue,
  });
};

const handleSuccess = async (
  responseJson: any,
  onSuccess: any,
  actionId: any,
  router: any,
  rest: any,
  component: any,
  endpoint: any,
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

  const varName = `${endpoint?.methodType} ${endpoint?.relativeUrl}`;
  const varValue = JSON.stringify(responseJson);

  await createVariable(router.query.id as string, {
    name: varName,
    value: varValue,
    defaultValue: null,
    type: "OBJECT" as FrontEndTypes,
    isGlobal: false,
    pageId: router.query.page as string,
  });
};

export const loginAction = async ({
  actionId,
  action,
  router,
  onSuccess,
  onError,
  component,
  ...rest
}: LoginActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const { endpoint, url, body } = await prepareRequestData(router, action);

  try {
    updateTreeComponent(
      component.id!,
      {
        loading: action.showLoader,
      },
      false,
    );

    const response = await fetch(url, {
      method: endpoint?.methodType,
      headers: {
        "Content-Type": endpoint?.mediaType ?? "application/json",
      },
      ...(!!body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status.toString().startsWith("5")) {
      const error = await readDataFromStream(response.body);

      throw new Error(error);
    }

    const responseJson = await response.json();

    const projectId = router.query.id as string;

    const dataSourceAuthConfig = await getDataSourceAuth(
      projectId,
      endpoint?.dataSourceId!,
    );

    const mergedAuthConfig = { ...responseJson, ...dataSourceAuthConfig };

    const authStore = useAuthStore.getState();
    authStore.setAuthTokens(mergedAuthConfig);

    await handleSuccess(
      responseJson,
      onSuccess,
      actionId,
      router,
      rest,
      component,
      endpoint,
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
      endpoint,
      actionMapper,
      updateTreeComponent,
    );
  }
};

export const apiCallAction = async ({
  actionId,
  action,
  router,
  onSuccess,
  onError,
  component,
  ...rest
}: APICallActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const { endpoint, url, body } = await prepareRequestData(router, action);

  try {
    updateTreeComponent(
      component.id!,
      {
        loading: action.showLoader,
      },
      false,
    );

    const authStore = useAuthStore.getState();
    authStore.refreshAccessToken();

    let authHeaderKey =
      endpoint?.authenticationScheme === "BEARER"
        ? "Bearer " + authStore.getAccessToken()
        : "";

    const fetchUrl = endpoint?.isServerRequest
      ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
      : url;

    const response = await fetch(fetchUrl, {
      method: endpoint?.methodType,
      headers: {
        // Will need to build up headers from endpoint.headers in future
        "Content-Type": endpoint?.mediaType ?? "application/json",
        ...(authHeaderKey ? { Authorization: authHeaderKey } : {}),
      },
      ...(!!body ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status.toString().startsWith("5")) {
      const error = await readDataFromStream(response.body);

      throw new Error(error);
    }

    const responseJson = await response.json();

    await handleSuccess(
      responseJson,
      onSuccess,
      actionId,
      router,
      rest,
      component,
      endpoint,
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
      endpoint,
      actionMapper,
      updateTreeComponent,
    );
  }
};

export type BindResponseToComponentActionParams = ActionParams & {
  action: BindResponseToComponentAction;
};

export const bindResponseToComponentAction = ({
  action,
  data,
}: BindResponseToComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  action.binds?.forEach((bind) => {
    if (bind.component && bind.value) {
      const dataFlatten = flattenKeysWithRoot(data);
      const value = get(dataFlatten, bind.value);
      updateTreeComponent(
        bind.component,
        {
          data: { value, base: data },
          dataPath: bind.value.startsWith("root[0].")
            ? bind.value.split("root[0].")[1]
            : bind.value.split("root.")[1],
        },
        false,
      );
    }
  });
};

export type BindVariableToChartActionParams = ActionParams & {
  action: BindVariableToChartAction;
};

export const bindVariableToChartAction = async ({
  action,
}: BindVariableToChartActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const currentProjectId = useEditorStore.getState().currentProjectId;
  const seriesVariable = action.series.split(`var_`)[1];
  let seriesVar: string | number[] = seriesVariable;
  if (seriesVariable.startsWith("{") && seriesVariable.endsWith("}")) {
    seriesVar = JSON.parse(seriesVariable);
  }

  const isSeriesObject = typeof seriesVar === "object";

  const labelsVariable = action.labels.split(`var_`)[1];
  let labelsVar: string | number[] = labelsVariable;
  if (labelsVariable.startsWith("{") && labelsVariable.endsWith("}")) {
    labelsVar = JSON.parse(labelsVariable);
  }

  const isLabelsObject = typeof labelsVar === "object";

  if (action.component && seriesVar) {
    const variableSeries = await getVariable(
      currentProjectId!,
      isSeriesObject ? (seriesVar as any).id : seriesVar,
    );

    let seriesValue = variableSeries.value;
    if (variableSeries.type === "OBJECT") {
      const dataFlatten = flattenKeys(JSON.parse(variableSeries.value ?? "{}"));

      seriesValue = get(dataFlatten, (seriesVar as any).path);
    }

    const variableLabels = await getVariable(
      currentProjectId!,
      isLabelsObject ? (labelsVar as any).id : labelsVar,
    );

    let labelsValue = variableLabels.value;
    if (variableLabels.type === "OBJECT") {
      const dataFlatten = flattenKeys(JSON.parse(variableLabels.value ?? "{}"));

      labelsValue = get(dataFlatten, (labelsVar as any).path);
    }

    updateTreeComponent(
      action.component,
      {
        data: {
          series: {
            value: seriesValue,
            base:
              variableSeries.type === "OBJECT"
                ? JSON.parse(variableSeries.value ?? "{}")
                : undefined,
            path: (seriesVar as any)?.path ?? undefined,
          },
          labels: {
            value: labelsValue,
            base:
              variableLabels.type === "OBJECT"
                ? JSON.parse(variableLabels.value ?? "{}")
                : undefined,
            path: (labelsVar as any)?.path ?? undefined,
          },
        },
      },
      false,
    );
  }
};

export type BindVariableToComponentActionParams = ActionParams & {
  action: BindVariableToComponentAction;
};

export const bindVariableToComponentAction = async ({
  action,
}: BindVariableToComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const currentProjectId = useEditorStore.getState().currentProjectId;
  const actionVariable = action.variable.split(`var_`)[1];
  let _var: string | { id: string; path: string } = actionVariable;
  if (actionVariable.startsWith("{") && actionVariable.endsWith("}")) {
    _var = JSON.parse(actionVariable);
  }

  const isObject = typeof _var === "object";

  if (action.component && _var) {
    const variable = await getVariable(
      currentProjectId!,
      isObject ? (_var as any).id : _var,
    );

    let value = variable.value;
    let defaultValue = variable.defaultValue;
    if (variable.type === "OBJECT") {
      const valueFlatten = flattenKeys(JSON.parse(variable.value || "{}"));
      value = get(valueFlatten, (_var as any).path);

      const defaultValueFlatten = flattenKeys(
        JSON.parse(variable.defaultValue || "{}"),
      );
      defaultValue = get(defaultValueFlatten, (_var as any).path);
    }

    updateTreeComponent(
      action.component,
      {
        data: {
          value,
          base:
            variable.type === "OBJECT"
              ? JSON.parse(variable.value || "{}")
              : undefined,
        },
        exampleData: {
          value: defaultValue,
          base:
            variable.type === "OBJECT"
              ? JSON.parse(variable.defaultValue || "{}")
              : undefined,
        },
        headers: value
          ? Object.keys(value[0]).reduce((acc, key) => {
              return {
                ...acc,
                [key]: typeof key === "string",
              };
            }, {})
          : {},
        dataPath: (_var as any)?.path ?? undefined,
      },
      false,
    );
  }
};

export const reloadComponentAction = ({
  action,
}: ReloadComponentActionParams) => {
  const editorTree = useEditorStore.getState().tree;
  const removeOnMountActionsRan =
    useEditorStore.getState().removeOnMountActionsRan;
  const component = getComponentById(editorTree.root, action.componentId);

  const onMountActionId = component?.actions?.find(
    (a) => a.trigger === "onMount",
  )?.id;

  if (onMountActionId) {
    removeOnMountActionsRan(onMountActionId);
  }
};

export const bindPlaceDataAction = ({
  action,
  data,
}: BindPlaceDataActionParams) => {
  const editorTree = useEditorStore.getState().tree;
  const component = getComponentById(
    editorTree.root,
    action.componentId!,
  ) as Component;
  const updateTreeComponentChildren =
    useEditorStore.getState().updateTreeComponentChildren;

  const googleMap = component.children?.filter(
    (child) => child.name === "GoogleMap",
  )[0];

  if (data !== undefined) {
    const predictions: { description: string; place_id: string }[] =
      data.predictions.map((item: Record<string, any>) => {
        return {
          description: item.description as string,
          place_id: item.place_id as string,
        };
      });
    const newPredictions = predictions.map((pred) => {
      const predId = nanoid();
      const child = {
        id: nanoid(),
        name: "Text",
        description: "Search Address In Map",
        props: {
          children: pred.description,
          place_Id: pred.place_id,
          sx: {
            "&:hover": {
              backgroundColor: `black.9`,
            },
            cursor: "pointer",
          },
        },
        actions: [
          {
            id: predId,
            trigger: "onClick",
            action: {
              name: "apiCall",
              showLoader: true,
              endpoint: action.endpoint,
              binds: {
                ...action.binds,
                parameter: {
                  ...action.binds?.parameter,
                  place_id: pred.place_id,
                },
              },
              datasources: action.datasources,
            },
          },
          {
            id: nanoid(),
            trigger: "onSuccess",
            sequentialTo: predId,
            action: {
              name: "bindPlaceGeometry",
              key: action.binds?.parameter.key,
            },
          },
        ],
        blockDroppingChildrenInside: true,
      };
      return child as Component;
    });
    updateTreeComponentChildren(component.id!, [
      ...newPredictions,
      googleMap as Component,
    ]);
  } else updateTreeComponentChildren(component.id!, []);
};

export const bindPlaceGeometryAction = ({
  data: { result },
  action: { key },
}: BindPlaceGeometryActionParams) => {
  const editorTree = useEditorStore.getState().tree;
  const { updateTreeComponentChildren, updateTreeComponent } =
    useEditorStore.getState();
  const searchResults = getAllComponentsByName(editorTree.root, "Text").filter(
    (component) => component.description === "Search Address In Map",
  );
  const parent = getComponentParent(
    editorTree.root,
    searchResults[0].id!,
  ) as Component;

  const ancestor = getComponentParent(editorTree.root, parent.id!) as Component;
  const {
    formatted_address,
    geometry: { location },
  } = result;
  const child = {
    id: nanoid(),
    name: "GoogleMap",
    description: "GoogleMap",
    props: {
      style: {
        width: "100%",
        height: "500px",
      },
      center: location as Position,
      apiKey: key,
      zoom: 10,
      language: "en",
      markers: [
        {
          id: nanoid(),
          name: formatted_address,
          position: location as Position,
        },
      ],
      options: { mapTypeId: "SATELITE", styles: [] } as Options,
    },
    blockDroppingChildrenInside: true,
  } as Component;
  updateTreeComponent(
    ancestor.children![0].id!,
    { value: formatted_address },
    true,
  );
  updateTreeComponentChildren(parent.id!, [child]);
};

export const changeLanguageAction = ({
  action,
}: ChangeLanguageActionParams) => {
  const { setLanguage } = useEditorStore.getState();
  setLanguage(action.language);
};

// IMPORTANT: do not delete the variable data as it is used in the eval
export const customJavascriptAction = ({ action, data }: any) => {
  const codeTranspiled = transpile(action.code);
  return eval(codeTranspiled);
};

export type TransformVariableActionParams = ActionParams & {
  action: TransformVariableAction;
};

export const transformVariableAction = async ({
  action,
  data,
}: TransformVariableActionParams) => {
  const { currentProjectId, currentPageId } = useEditorStore.getState();
  let codeTranspiled = transpile(action.value);
  // Regex to find variable between /* var_<var-id> start */ and /* var_<var-id> end */
  const variableRegex =
    /\/\* var_(.*?) start \*\/(.*?)\/\* var_(.*?) end \*\//gs;
  const variableMatches = codeTranspiled.matchAll(variableRegex);
  for (const match of variableMatches) {
    const variableId = match[1];
    const variable = await getVariable(currentProjectId!, variableId);
    codeTranspiled = codeTranspiled.replace(
      match[0],
      variable.value ?? variable.defaultValue ?? match[0],
    );
  }
  let result = eval(codeTranspiled);
  const isObject = typeof result === "object";
  if (isObject) {
    result = JSON.stringify(result);
  } else {
    result = String(result);
  }

  await createVariable(currentProjectId!, {
    name: action.variableName,
    value: result,
    type: isObject ? "OBJECT" : "TEXT",
    isGlobal: false,
    pageId: currentPageId!,
    defaultValue: result,
  });
};

export const actionMapper = {
  alert: {
    action: debugAction,
    form: DebugActionForm,
    flowForm: DebugFlowActionForm,
  },
  setVariable: {
    action: setVariableAction,
    form: SetVariableActionForm,
    flowForm: SetVariableFlowActionForm,
  },
  transformVariable: {
    action: transformVariableAction,
    // TODO: Create a proper form for action outside flow
    form: TransformVariableActionForm,
    flowForm: TransformVariableFlowActionForm,
  },
  navigateToPage: {
    action: navigationAction,
    form: NavigationActionForm,
    flowForm: NavigationFlowActionForm,
  },
  apiCall: {
    action: apiCallAction,
    form: APICallActionForm,
    flowForm: APICallFlowActionForm,
  },
  bindResponse: {
    action: bindResponseToComponentAction,
    form: BindResponseToComponentActionForm,
    flowForm: BindResponseToComponentFlowActionForm,
  },
  bindVariable: {
    action: bindVariableToComponentAction,
    form: BindVariableToComponentActionForm,
    flowForm: BindVariableToComponentFlowActionForm,
  },
  bindVariableToChart: {
    action: bindVariableToChartAction,
    // TODO: Create a proper form for action outside flow
    form: BindVariableToComponentActionForm,
    flowForm: BindVariableToChartFlowActionForm,
  },
  goToUrl: {
    action: goToUrlAction,
    form: GoToUrlForm,
    flowForm: GoToUrlFlowActionForm,
  },
  login: {
    action: loginAction,
    form: LoginActionForm,
    flowForm: LoginFlowActionForm,
  },
  openModal: {
    action: openModalAction,
    form: OpenModalActionForm,
    flowForm: OpenModalFlowActionForm,
  },
  closeModal: {
    action: closeModalAction,
    form: OpenModalActionForm,
    flowForm: CloseModalFlowActionForm,
  },
  openDrawer: {
    action: openDrawerAction,
    form: OpenDrawerActionForm,
    flowForm: OpenDrawerFlowActionForm,
  },
  triggerLogicFlow: {
    action: triggerLogicFlowAction,
    form: TriggerLogicFlowActionForm,
    flowForm: TriggerLogicFlowForm,
  },
  closeDrawer: {
    action: closeDrawerAction,
    form: OpenDrawerActionForm,
    flowForm: CloseDrawerFlowActionForm,
  },
  openPopOver: {
    action: openPopOverAction,
    form: OpenPopOverActionForm,
    flowForm: OpenPopOverFlowActionForm,
  },
  closePopOver: {
    action: closePopOverAction,
    form: OpenPopOverActionForm,
    flowForm: ClosePopOverFlowActionForm,
  },
  openToast: {
    action: openToastAction,
    form: OpenToastActionForm,
    flowForm: OpenToastFlowActionForm,
  },
  changeState: {
    action: changeStateAction,
    form: ChangeStateActionForm,
    flowForm: ChangeStateActionFlowForm,
  },
  toggleVisibility: {
    action: togglePropsAction,
    form: TogglePropsActionForm,
    flowForm: TogglePropsFlowActionForm,
  },
  reloadComponent: {
    action: reloadComponentAction,
    form: ReloadComponentActionForm,
    flowForm: ReloadComponentFlowActionForm,
  },
  toggleNavbar: {
    action: toggleNavbarAction,
    form: TogglePropsActionForm,
    flowForm: TogglePropsFlowActionForm,
  },
  changeStep: {
    action: changeStepAction,
    form: ChangeStepActionForm,
    flowForm: ChangeStepFlowActionForm,
  },
  bindPlaceData: {
    action: bindPlaceDataAction,
    form: BindPlaceDataActionForm,
    flowForm: BindPlaceDataFlowActionForm,
  },
  bindPlaceGeometry: {
    action: bindPlaceGeometryAction,
    form: BindPlaceDataActionForm,
    flowForm: BindPlaceDataFlowActionForm,
  },
  changeLanguage: {
    action: changeLanguageAction,
    form: ChangeLanguageActionForm,
    flowForm: ChangeLanguageFlowActionForm,
  },
  customJavascript: {
    action: customJavascriptAction,
    form: CustomJavascriptActionForm,
    flowForm: CustomJavascriptFlowActionForm,
  },
};
