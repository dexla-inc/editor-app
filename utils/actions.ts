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
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { OpenDrawerActionForm } from "@/components/actions/OpenDrawerActionForm";
import { OpenModalActionForm } from "@/components/actions/OpenModalActionForm";
import { OpenPopOverActionForm } from "@/components/actions/OpenPopOverActionForm";
import { OpenToastActionForm } from "@/components/actions/OpenToastActionForm";
import { ReloadComponentActionForm } from "@/components/actions/ReloadComponentActionForm";
import { ToggleAccordionItemActionForm } from "@/components/actions/ToggleAccordionItemActionForm";
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
import { transpile } from "typescript";

import { ChangeVariableActionForm } from "@/components/actions/ChangeVariableActionForm";
import { BindVariableToChartFlowActionForm } from "@/components/actions/logic-flow-forms/BindVariableToChartFlowActionForm";
import { ChangeVariableFlowActionForm } from "@/components/actions/logic-flow-forms/ChangeVariableFlowActionForm";
import { GoToUrlFlowActionForm } from "@/components/actions/logic-flow-forms/GoToUrlFlowActionForm";
import { NavigationFlowActionForm } from "@/components/actions/logic-flow-forms/NavigationFlowActionForm";
import { OpenDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/OpenDrawerFlowActionForm";
import { OpenModalFlowActionForm } from "@/components/actions/logic-flow-forms/OpenModalFlowActionForm";
import { OpenPopOverFlowActionForm } from "@/components/actions/logic-flow-forms/OpenPopOverFlowActionForm";
import { OpenToastFlowActionForm } from "@/components/actions/logic-flow-forms/OpenToastFlowActionForm";
import { ReloadComponentFlowActionForm } from "@/components/actions/logic-flow-forms/ReloadComponentFlowActionForm";
import { TogglePropsFlowActionForm } from "@/components/actions/logic-flow-forms/TogglePropsFlowActionForm";
import { TriggerLogicFlowActionForm as TriggerLogicFlowForm } from "@/components/actions/logic-flow-forms/TriggerLogicFlowActionForm";
import { Position } from "@/components/mapper/GoogleMapPlugin";
import { Options } from "@/components/modifiers/GoogleMap";
import { DataSourceResponse, Endpoint } from "@/requests/datasources/types";
import { upsertVariable } from "@/requests/variables/mutations";
import {
  getVariable,
  listVariables,
} from "@/requests/variables/queries-noauth";
import { VariableParams } from "@/requests/variables/types";
import { useAuthStore } from "@/stores/auth";
import { useDataSourceStore } from "@/stores/datasource";
import { useEditorStore } from "@/stores/editor";
import { useVariableStore } from "@/stores/variables";
import { readDataFromStream } from "@/utils/api";
import {
  Component,
  getAllComponentsByName,
  getComponentById,
  getComponentParent,
} from "@/utils/editor";
import { flattenKeys, flattenKeysWithRoot } from "@/utils/flattenKeys";
import { executeFlow } from "@/utils/logicFlows";
import { getParsedJSCode } from "@/utils/variables";
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
  | "Data"
  | "Logic"
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
  { name: "apiCall", group: "Data", icon: "IconApi" },
  { name: "changeVariable", group: "Data" }, // Merge bindVariable, changeVariable and bindVariableToChart
  { name: "bindResponse", group: "Data" }, // Merge bindVariable, changeVariable and bindVariableToChart
  { name: "changeState", group: "Design", icon: "IconTransform" },
  { name: "triggerLogicFlow", group: "Logic", icon: "IconFlow" },
  { name: "navigateToPage", group: "Navigation", icon: "IconFileInvoice" },
  { name: "goToUrl", group: "Navigation", icon: "IconLink" },
  { name: "openToast", group: "Feedback" },
  { name: "alert", group: "Feedback", icon: "IconAlert" },
  { name: "customJavascript", group: "Utilities & Tools", icon: "IconCode" },
  { name: "copyToClipboard", group: "Utilities & Tools", icon: "IconCopy" },
  {
    name: "changeLanguage",
    group: "Utilities & Tools",
    icon: "IconMessageLanguage",
  },
  { name: "bindVariable", group: "Z Delete" }, // Merge bindVariable, changeVariable and bindVariableToChart
  { name: "bindVariableToChart", group: "Z Delete" },
  { name: "reloadComponent", group: "Z Delete", icon: "IconReload" },
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
  { name: "toggleVisibility", group: "Z Delete" },
  { name: "bindPlaceData", group: "Z Delete", icon: "IconMap" },
  { name: "bindPlaceGeometry", group: "Z Delete", icon: "IconMap" },
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
  isLogin?: boolean;
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

export interface ChangeVariableAction extends BaseAction {
  name: "changeVariable";
  variableId: string;
  bindingType: string;
  javascriptCode: string;
  formulaCondition: string;
  formulaValue: string;
}

export type Action = {
  id: string;
  trigger: ActionTrigger;
  action:
    | NavigationAction
    | AlertAction
    | APICallAction
    | BindResponseToComponentAction
    | GoToUrlAction
    | OpenModalAction
    | OpenDrawerAction
    | OpenPopOverAction
    | ToggleAccordionItemAction
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
    | ChangeVariableAction
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
  const isLive = useEditorStore.getState().isLive;
  const projectId = useEditorStore.getState().currentProjectId;

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
    const currentProjectId = useEditorStore.getState().currentProjectId;
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

export const debugAction = async ({ action }: DebugActionParams) => {
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
  updateTreeComponent({
    componentId: action.modalId,
    props: { opened: true },
    save: false,
  });
};

export const closeModalAction = ({ action }: OpenModalActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent({
    componentId: action.modalId,
    props: { opened: false },
    save: false,
  });
};

export const openDrawerAction = ({ action }: OpenDrawerActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent({
    componentId: action.drawerId,
    props: { opened: true },
    save: false,
  });
};

export const toggleAccordionItemAction = ({
  action,
}: ToggleAccordionItemActionParams) => {
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

export const closeDrawerAction = ({ action }: OpenDrawerActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent({
    componentId: action.drawerId,
    props: { opened: false },
    save: false,
  });
};

export const openPopOverAction = ({ action }: OpenPopOverActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent({
    componentId: action.popOverId,
    props: { opened: true },
    save: false,
  });
};

export const closePopOverAction = ({ action }: OpenPopOverActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  updateTreeComponent({
    componentId: action.popOverId,
    props: { opened: false },
    save: false,
  });
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

  updateTreeComponent({
    componentId: action.stepperId,
    props: { activeStep },
    save: false,
  });
};
export const togglePropsAction = ({
  action,
  event,
}: TogglePropsActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;

  let componentId = "";
  action.conditionRules.forEach((item) => {
    if (item.condition === event) {
      componentId = item.componentId;
    }

    updateTreeComponent({
      componentId: item.componentId,
      props: {
        style: { display: "none" },
      },
      save: false,
    });
  });

  updateTreeComponent({
    componentId: componentId,
    props: {
      style: { display: "flex" },
    },
    save: false,
  });
};
export const toggleNavbarAction = ({ action }: ToggleNavbarActionParams) => {
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
    const variableId = isObject ? (_var as any).id : _var;
    const variable = variableList.find(
      (v) => v.id === variableId || v.name === variableId,
    );

    if (!variable) return;
    let value = variable.value ?? variable.defaultValue;
    if (isObject) {
      const dataFlatten = flattenKeys(
        JSON.parse(variable.value ?? variable.defaultValue ?? "{}"),
      );

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

export const triggerLogicFlowAction = (
  params: TriggerLogicFlowActionParams,
) => {
  executeFlow(params.action.logicFlowId, params);
};

export const changeStateAction = ({
  action,
  event,
}: ChangeStateActionParams) => {
  const setTreeComponentCurrentState =
    useEditorStore.getState().setTreeComponentCurrentState;
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
    let value = key;
    const iframeWindow = useEditorStore.getState().iframeWindow;

    if (key.startsWith(`valueOf_`)) {
      value = getElementValue(key, iframeWindow);
    }

    if (key?.startsWith(`queryString_pass_`)) {
      value = getQueryElementValue(key, iframeWindow);
    }

    if (key.startsWith(`var_`)) {
      value = getVariableValueFromVariableId(key) as string;
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

const prepareRequestData = async (action: any) => {
  const cachedEndpoints = useDataSourceStore.getState().endpoints as Endpoint[];
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
  return {
    "Content-Type": endpoint?.mediaType ?? "application/json",
    ...(authHeaderKey ? { Authorization: authHeaderKey } : {}),
  };
}

// Function to perform the fetch operation
async function performFetch(
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

  if (response.status.toString().startsWith("5")) {
    const error = await readDataFromStream(response.body);
    throw new Error(error);
  }

  return response.json();
}

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
  const { endpoint, url, body } = await prepareRequestData(action);
  const apiAuthConfig = useDataSourceStore.getState().apiAuthConfig;

  try {
    updateTreeComponent({
      componentId: component.id!,
      props: {
        loading: action.showLoader,
      },
    });

    let responseJson;
    if (action.isLogin) {
      responseJson = await performFetch(url, endpoint, body);

      const mergedAuthConfig = { ...responseJson, ...apiAuthConfig };
      const setAuthTokens = useAuthStore.getState().setAuthTokens;
      setAuthTokens(mergedAuthConfig);
    } else {
      const refreshAccessToken = useAuthStore.getState().refreshAccessToken;
      const getAccessToken = useAuthStore.getState().getAccessToken;

      refreshAccessToken();

      let authHeaderKey =
        endpoint?.authenticationScheme === "BEARER"
          ? "Bearer " + getAccessToken()
          : "";

      const fetchUrl = endpoint?.isServerRequest
        ? `/api/proxy?targetUrl=${encodeURIComponent(url)}`
        : url;

      responseJson = await performFetch(
        fetchUrl,
        endpoint,
        body,
        authHeaderKey,
      );
    }

    updateTreeComponent({
      componentId: component.id!,
      props: {
        loading: false,
      },
    });

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
      updateTreeComponent({
        componentId: bind.component,
        props: {
          data: { value, base: data },
          dataPath: bind.value.startsWith("root[0].")
            ? bind.value.split("root[0].")[1]
            : bind.value.split("root.")[1],
        },
        save: false,
      });
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

    updateTreeComponent({
      componentId: action.component,
      props: {
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
      save: false,
    });
  }
};

export type BindVariableToComponentActionParams = ActionParams & {
  action: BindVariableToComponentAction;
};

export const bindVariableToComponentAction = async ({
  action,
}: BindVariableToComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const actionVariable = action.variable.split(`var_`)[1];
  let _var: string | { id: string; variable: VariableParams; path: string } =
    actionVariable;
  if (actionVariable.startsWith("{") && actionVariable.endsWith("}")) {
    _var = JSON.parse(actionVariable);
  }

  const isObject = typeof _var === "object";

  if (action.component && _var) {
    const variables = useVariableStore.getState();
    const variable = variables[isObject ? (_var as any).variable.name : _var];

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

    updateTreeComponent({
      componentId: action.component,
      props: {
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
      save: false,
    });
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
  const updateTreeComponentChildren =
    useEditorStore.getState().updateTreeComponentChildren;
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
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
      options: {
        mapTypeId: "SATELITE",
        styles: [],
        mapTypeControl: true,
      } as Options,
    },
    blockDroppingChildrenInside: true,
  } as Component;
  updateTreeComponent({
    componentId: ancestor.children![0].id!,
    props: { value: formatted_address },
    save: true,
  });
  updateTreeComponentChildren(parent.id!, [child]);
};

export const changeLanguageAction = ({
  action,
}: ChangeLanguageActionParams) => {
  const setLanguage = useEditorStore.getState().setLanguage;
  setLanguage(action.language);
};

// IMPORTANT: do not delete the variable data as it is used in the eval
export const customJavascriptAction = ({ action, data }: any) => {
  const codeTranspiled = transpile(action.code);
  return eval(codeTranspiled);
};

export type ChangeVariableActionParams = ActionParams & {
  action: ChangeVariableAction;
};

export const changeVariableAction = async ({
  action,
}: ChangeVariableActionParams) => {
  const currentProjectId = useEditorStore.getState().currentProjectId;
  const currentPageId = useEditorStore.getState().currentPageId;
  let isPreviewValueObject = false;
  let isPreviewValueArray = false;

  if (action.bindingType === "JavaScript") {
    try {
      const variables = await listVariables(currentProjectId!, {
        pageId: currentPageId!,
      }).then(({ results }) => {
        return results.reduce(
          (acc, variable) => {
            const value = variable.value ?? variable.defaultValue;
            acc.list[variable.id] = variable;

            const isObject = typeof value === "object";

            acc[variable.id] = isObject ? JSON.parse(value ?? "{}") : value;
            acc[variable.name] = isObject ? JSON.parse(value ?? "{}") : value;
            return acc;
          },
          { list: {} } as Record<string, any>,
        );
      });
      if (!action.javascriptCode) return;

      if (action.javascriptCode === "return variables") {
        return;
      }

      const parsedCode = getParsedJSCode(action.javascriptCode);

      let previewNewValue = eval(
        `function autoRunJavascriptCode() { ${parsedCode}}; autoRunJavascriptCode()`,
      );

      isPreviewValueObject = typeof previewNewValue === "object";
      isPreviewValueArray = Array.isArray(previewNewValue);

      if (typeof previewNewValue !== "string") {
        previewNewValue = JSON.stringify(previewNewValue);
      }

      const variable = variables.list[action.variableId];

      upsertVariable(currentProjectId!, {
        name: variable.name,
        value:
          typeof previewNewValue === "string"
            ? previewNewValue
            : JSON.stringify(previewNewValue),
        type: isPreviewValueArray
          ? "ARRAY"
          : isPreviewValueObject
          ? "OBJECT"
          : "TEXT",
        isGlobal: variable.isGlobal ?? false,
        pageId: currentPageId!,
        defaultValue:
          typeof previewNewValue === "string"
            ? previewNewValue
            : JSON.stringify(previewNewValue),
      });
    } catch (error) {
      console.log({ error });
      return;
    }
  }
};

export const actionMapper = {
  alert: {
    action: debugAction,
    form: DebugActionForm,
    flowForm: DebugFlowActionForm,
  },
  changeVariable: {
    action: changeVariableAction,
    form: ChangeVariableActionForm,
    flowForm: ChangeVariableFlowActionForm,
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
    form: BindVariableToComponentActionForm,
    flowForm: BindVariableToChartFlowActionForm,
  },
  goToUrl: {
    action: goToUrlAction,
    form: GoToUrlForm,
    flowForm: GoToUrlFlowActionForm,
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
  toggleAccordionItem: {
    action: toggleAccordionItemAction,
    form: ToggleAccordionItemActionForm,
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
