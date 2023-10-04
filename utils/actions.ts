import { transpile } from "typescript";

import { APICallActionForm } from "@/components/actions/APICallActionForm";
import { BindPlaceDataActionForm } from "@/components/actions/BindPlaceDataActionForm";
import { BindResponseToComponentActionForm } from "@/components/actions/BindResponseToComponentActionForm";
import { BindVariableToComponentActionForm } from "@/components/actions/BindVariableToComponentActionForm";
import { ChangeLanguageActionForm } from "@/components/actions/ChangeLanguageActionForm";
import { ChangeStateActionForm } from "@/components/actions/ChangeStateActionForm";
import { ChangeStepActionForm } from "@/components/actions/ChangeStepActionForm";
import { CloseModalActionForm } from "@/components/actions/CloseModalActionForm";
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
import { CustomJavascriptActionForm } from "@/components/actions/CustomJavascriptActionForm";
import { TriggerLogicFlowActionForm } from "@/components/actions/TriggerLogicFlowActionForm";
import { APICallFlowActionForm } from "@/components/actions/logic-flow-forms/APICallFlowActionForm";
import { BindVariableToComponentFlowActionForm } from "@/components/actions/logic-flow-forms/BindVariableToComponentFlowActionForm";
import { OpenDrawerFlowActionForm } from "@/components/actions/logic-flow-forms/OpenDrawerFlowActionForm";
import { OpenModalFlowActionForm } from "@/components/actions/logic-flow-forms/OpenModalFlowActionForm";
import { OpenToastFlowActionForm } from "@/components/actions/logic-flow-forms/OpenToastFlowActionForm";
import { SetVariableFlowActionForm } from "@/components/actions/logic-flow-forms/SetVariableFlowActionForm";
import { CustomJavascriptFlowActionForm } from "@/components/actions/logic-flow-forms/CustomJavascriptFlowActionForm";
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
import {
  Component,
  getAllComponentsByName,
  getComponentById,
  getComponentParent,
} from "@/utils/editor";
import { flattenKeys, flattenKeysWithRoot } from "@/utils/flattenKeys";
import { showNotification } from "@mantine/notifications";
import get from "lodash.get";
import { nanoid } from "nanoid";
import { Router } from "next/router";
import { executeFlow } from "./logicFlows";

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
  "onPaginationChange",
  "onSort",
  "onFilterApplied",
  "onSuccess",
  "onError",
] as const;

export const actions = [
  { name: "apiCall", group: "API & Data" },
  { name: "bindResponse", group: "API & Data" },
  { name: "bindVariable", group: "API & Data" },
  { name: "login", group: "API & Data" },
  { name: "setVariable", group: "API & Data" },
  { name: "bindPlaceData", group: "Third-Party Plugins" },
  { name: "bindPlaceGeometry", group: "Third-Party Plugins" },
  { name: "goToUrl", group: "Navigation" },
  { name: "navigateToPage", group: "Navigation" },
  { name: "changeStep", group: "Navigation" },
  { name: "openDrawer", group: "Modal & Overlays" },
  { name: "closeDrawer", group: "Modal & Overlays" },
  { name: "openModal", group: "Modal & Overlays" },
  { name: "closeModal", group: "Modal & Overlays" },
  { name: "openPopOver", group: "Modal & Overlays" },
  { name: "closePopOver", group: "Modal & Overlays" },
  { name: "toggleVisibility", group: "Style & Props" },
  { name: "alert", group: "Feedback" },
  { name: "changeState", group: "Feedback" },
  { name: "openToast", group: "Feedback" },
  { name: "reloadComponent", group: "Feedback" },
  { name: "copyToClipboard", group: "Utilities & Tools" },
  { name: "triggerLogicFlow", group: "Utilities & Tools" },
  { name: "changeLanguage", group: "Utilities & Tools" },
  { name: "customJavascript", group: "Utilities & Tools" },
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
  variableType: string;
  path: string;
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

export interface BindPlaceDataAction extends BaseAction {
  name: "bindPlaceData";
  componentId: string;
}

export interface BindPlaceGeometryAction extends BaseAction {
  name: "bindPlaceGeometry";
  componentId: string;
}

export interface ChangeLanguageAction extends BaseAction {
  name: "changeLanguage";
  language: "default" | "french";
}

export interface CustomJavascriptAction extends BaseAction {
  name: "customJavascript";
  code: string;
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
    | BindVariableToComponentAction;
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

export const goToUrlAction = ({ action }: GoToUrlParams) => {
  const { url, openInNewTab } = action;

  if (url.startsWith("dataPath_")) {
    const { tree: editorTree } = useEditorStore.getState();
    const path = url.split(`dataPath_`)[1];
    const componentId = path.split(".")[0];
    const component = getComponentById(editorTree.root, componentId);
  }

  if (openInNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
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

export const openToastAction = async ({ action }: OpenToastActionParams) => {
  showNotification({ title: action.title, message: action.message });
};

export const setVariableAction = async ({
  action,
}: SetVariableActionParams) => {
  const projectId = useEditorStore.getState().currentProjectId;
  const variable = JSON.parse(action.variable);
  updateVariable(projectId!, variable.id, { ...variable, value: action.value });
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
  action.conditionRules.forEach((item) => {
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

export type APICallActionParams = ActionParams & {
  action: APICallAction;
};

export type LoginActionParams = ActionParams & {
  action: LoginAction;
};

let cachedEndpoints: Endpoint[] | undefined;

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

  try {
    const iframeWindow = useEditorStore.getState().iframeWindow;
    const projectId = router.query.id as string;

    updateTreeComponent(component.id!, { loading: true }, false);

    // TODO: Storing in memory for now as the endpoints API call is slow. We only ever want to call it once.
    // Can revisit later and create a cashing layer.
    if (!cachedEndpoints) {
      const { results } = await getDataSourceEndpoints(projectId);
      cachedEndpoints = results;
    }

    const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);
    const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;
    const keys = Object.keys(action.binds?.parameter ?? {});

    const url =
      keys.length > 0
        ? keys.reduce((url: string, key: string) => {
            key.startsWith("type_key_")
              ? (key = key.split(`type_Key_`)[1])
              : key;
            let value = action.binds?.parameter[key] as string;

            if (value?.startsWith(`valueOf_`)) {
              const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
          `) as HTMLInputElement;
              value = el?.value ?? "";
            }

            if (value?.startsWith(`queryString_pass_`)) {
              value = getQueryElementValue(value, iframeWindow);
            }

            return url.replace(`{${key}}`, value);
          }, apiUrl)
        : apiUrl;

    const body =
      endpoint?.methodType === "POST"
        ? Object.keys(action.binds?.body ?? {}).reduce(
            (body: string, key: string) => {
              let value = action.binds?.body[key] as string;

              if (value.startsWith(`valueOf_`)) {
                const el = iframeWindow?.document.querySelector(`
          input#${value.split(`valueOf_`)[1]}
        `) as HTMLInputElement;
                value = el?.value ?? "";
              }

              if (value?.startsWith(`queryString_pass_`)) {
                value = getQueryElementValue(value, iframeWindow);
              }

              return {
                ...(body as any),
                [key]: value,
              };
            },
            {} as any,
          )
        : undefined;

    const response = await fetch(url, {
      method: endpoint?.methodType,
      headers: {
        // Will need to build up headers from endpoint.headers in future
        "Content-Type": endpoint?.mediaType ?? "application/json",
      },
      ...(!!body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.status.toString().startsWith("20")) {
      throw new Error(response.statusText);
    }

    const responseJson = await response.json();

    const dataSourceAuthConfig = await getDataSourceAuth(
      projectId,
      endpoint?.dataSourceId!,
    );

    const mergedAuthConfig = { ...responseJson, ...dataSourceAuthConfig };

    const authStore = useAuthStore.getState();
    authStore.setAuthTokens(mergedAuthConfig);

    if (onSuccess && onSuccess.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess",
      )!;
      // @ts-ignore
      const onSuccessActionMapped = actionMapper[onSuccess.action.name];
      onSuccessActionMapped.action({
        // @ts-ignore
        action: onSuccessAction.action,
        router,
        ...rest,
        data: responseJson,
      });
    }
  } catch (error) {
    if (onError && onError.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError",
      )!;
      // @ts-ignore
      const onErrorActionMapped = actionMapper[onError.action.name];
      onErrorActionMapped.action({
        // @ts-ignore
        action: onErrorAction.action,
        router,
        ...rest,
        data: { value: (error as Error).message },
      });
    }
  } finally {
    updateTreeComponent(component.id!, { loading: false }, false);
  }
};

function getElementValue(value: string, iframeWindow: any): string {
  const _id = value.split("valueOf_")[1];
  let el = iframeWindow?.document.getElementById(_id);
  const tag = el?.tagName?.toLowerCase();

  if (tag !== "input") {
    el = el?.getElementsByTagName("input")[0];
  }

  return (el as HTMLInputElement)?.value ?? "";
}

function getQueryElementValue(value: string, iframeWindow: any): string {
  const el = iframeWindow?.document.querySelector(
    `input#${value.split("queryString_pass_")[1]}`,
  ) as HTMLInputElement;
  return el?.value ?? "";
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

  try {
    const iframeWindow = useEditorStore.getState().iframeWindow;
    const projectId = router.query.id as string;

    updateTreeComponent(
      component.id!,
      {
        // @ts-ignore
        loading: component.actions.find(
          (a: { id: string }) => a.id === actionId,
          // @ts-ignore
        ).action.showLoader,
      },
      false,
    );

    // TODO: Storing in memory for now as the endpoints API call is slow. We only ever want to call it once.
    // Can revisit later and create a cashing layer.
    if (!cachedEndpoints) {
      const { results } = await getDataSourceEndpoints(projectId);
      cachedEndpoints = results;
    }
    const endpoint = cachedEndpoints.find((e) => e.id === action.endpoint);

    const keys = Object.keys(action.binds?.parameter ?? {});

    const apiUrl = `${endpoint?.baseUrl}/${endpoint?.relativeUrl}`;
    console.log(apiUrl);
    const url =
      keys.length > 0
        ? keys.reduce((url: string, key: string) => {
            key.startsWith("type_Key_")
              ? (key = key.split(`type_key_`)[1])
              : key;
            // @ts-ignore
            let value = action.binds?.parameter[key] as string;

            if (value.startsWith(`valueOf_`)) {
              value = getElementValue(value, iframeWindow);
            }

            if (value?.startsWith(`queryString_pass_`)) {
              value = getQueryElementValue(value, iframeWindow);
            }

            if (!url.includes(`{${key}}`)) {
              const _url = new URL(url);
              _url.searchParams.append(key, value);
              return _url.toString();
            } else {
              return url.replace(`{${key}}`, value);
            }
          }, apiUrl)
        : apiUrl;

    const body =
      endpoint?.methodType === "POST"
        ? Object.keys(action.binds?.body ?? {}).reduce(
            (body: string, key: string) => {
              // @ts-ignore
              let value = action.binds.body[key] as string;

              if (value.startsWith(`valueOf_`)) {
                value = getElementValue(value, iframeWindow);
              }

              if (value?.startsWith(`queryString_pass_`)) {
                value = getQueryElementValue(value, iframeWindow);
              }

              return {
                ...(body as any),
                [key]: value,
              };
            },
            {} as any,
          )
        : undefined;

    // TODO: Need to add a binding for headers.
    // We could then remove the auth code below and just build headers up instead

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

    if (!response.status.toString().startsWith("20")) {
      throw new Error(response.statusText);
    }

    const responseJson = await response.json();
    const varName = `${endpoint?.methodType} ${endpoint?.relativeUrl}`;
    const varValue = JSON.stringify(responseJson);
    await createVariable(projectId, {
      name: varName,
      value: varValue,
      type: "OBJECT" as FrontEndTypes,
      isGlobal: false,
      pageId: router.query.page as string,
      defaultValue: varValue,
    });

    if (onSuccess && onSuccess.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onSuccessAction: Action = actions.find(
        (action: Action) => action.trigger === "onSuccess",
      )!;
      // @ts-ignore
      const onSuccessActionMapped = actionMapper[onSuccess.action.name];
      onSuccessActionMapped.action({
        // @ts-ignore
        action: onSuccessAction.action,
        binds: action.binds,
        router,
        ...rest,
        data: responseJson,
      });
    }
  } catch (error) {
    console.log({ error });
    if (onError && onError.sequentialTo === actionId) {
      const actions = component.actions ?? [];
      const onErrorAction: Action = actions.find(
        (action: Action) => action.trigger === "onError",
      )!;
      // @ts-ignore
      const onErrorActionMapped = actionMapper[onError.action.name];
      onErrorActionMapped.action({
        // @ts-ignore
        action: onErrorAction.action,
        router,
        ...rest,
        data: { value: (error as Error).message },
      });
    }
  } finally {
    updateTreeComponent(component.id!, { loading: false }, false);
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

export type BindVariableToComponentActionParams = ActionParams & {
  action: BindVariableToComponentAction;
};

export const bindVariableToComponentAction = async ({
  action,
}: BindVariableToComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const currentProjectId = useEditorStore.getState().currentProjectId;

  if (action.component && action.variable) {
    const variable = await getVariable(currentProjectId!, action.variable);

    let value = variable.value;
    if (variable.type === "OBJECT") {
      const dataFlatten = flattenKeys(JSON.parse(variable.value ?? "{}"));

      value = get(dataFlatten, action.path);
    }

    updateTreeComponent(
      action.component,
      {
        data: {
          value,
          base:
            variable.type === "OBJECT"
              ? JSON.parse(variable.value ?? "{}")
              : undefined,
        },
        dataPath: action.path,
      },
      false,
    );
  }
};

export const reloadComponentAction = ({
  action,
}: ReloadComponentActionParams) => {
  const updateTreeComponent = useEditorStore.getState().updateTreeComponent;
  const removeOnMountActionsRan =
    useEditorStore.getState().removeOnMountActionsRan;

  removeOnMountActionsRan(action.onMountActionId ?? "");
  updateTreeComponent(action.componentId, { key: nanoid() }, false);
};

export const bindPlaceDataAction = ({
  action,
  data,
}: BindPlaceDataActionParams) => {
  const editorTree = useEditorStore.getState().tree;
  const component = getComponentById(
    editorTree.root,
    action.componentId,
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
              endpoint: "ff9f1ab9b7ea4b458485653809250239",
              binds: {
                header: {
                  "Accept-Language": "en",
                },
                parameter: {
                  place_id: pred.place_id,
                  key: "AIzaSyCS8ncCNBG7tNRPOdFbdx7fh3Or5qpIpZM",
                  fields: "geometry,formatted_address,address_components",
                  sessiontoken: "dev",
                },
                body: {},
              },
            },
          },
          {
            id: nanoid(),
            trigger: "onSuccess",
            sequentialTo: predId,
            action: { name: "bindPlaceGeometry" },
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
      apiKey: "AIzaSyCS8ncCNBG7tNRPOdFbdx7fh3Or5qpIpZM",
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

export const actionMapper = {
  alert: {
    action: debugAction,
    form: DebugActionForm,
  },
  setVariable: {
    action: setVariableAction,
    form: SetVariableActionForm,
    flowForm: SetVariableFlowActionForm,
  },
  navigateToPage: {
    action: navigationAction,
    form: NavigationActionForm,
  },
  apiCall: {
    action: apiCallAction,
    form: APICallActionForm,
    flowForm: APICallFlowActionForm,
  },
  bindResponse: {
    action: bindResponseToComponentAction,
    form: BindResponseToComponentActionForm,
  },
  bindVariable: {
    action: bindVariableToComponentAction,
    form: BindVariableToComponentActionForm,
    flowForm: BindVariableToComponentFlowActionForm,
  },
  goToUrl: {
    action: goToUrlAction,
    form: GoToUrlForm,
  },
  login: {
    action: loginAction,
    form: LoginActionForm,
  },
  openModal: {
    action: openModalAction,
    form: OpenModalActionForm,
    flowForm: OpenModalFlowActionForm,
  },
  closeModal: {
    action: closeModalAction,
    form: CloseModalActionForm,
  },
  openDrawer: {
    action: openDrawerAction,
    form: OpenDrawerActionForm,
    flowForm: OpenDrawerFlowActionForm,
  },
  triggerLogicFlow: {
    action: triggerLogicFlowAction,
    form: TriggerLogicFlowActionForm,
  },
  closeDrawer: {
    action: closeDrawerAction,
    form: OpenDrawerActionForm,
  },
  openPopOver: {
    action: openPopOverAction,
    form: OpenPopOverActionForm,
  },
  closePopOver: {
    action: closePopOverAction,
    form: OpenPopOverActionForm,
  },
  openToast: {
    action: openToastAction,
    form: OpenToastActionForm,
    flowForm: OpenToastFlowActionForm,
  },
  changeState: {
    action: changeStateAction,
    form: ChangeStateActionForm,
  },
  toggleVisibility: {
    action: togglePropsAction,
    form: TogglePropsActionForm,
  },
  reloadComponent: {
    action: reloadComponentAction,
    form: ReloadComponentActionForm,
  },
  toggleNavbar: {
    action: toggleNavbarAction,
    form: TogglePropsActionForm,
  },
  changeStep: {
    action: changeStepAction,
    form: ChangeStepActionForm,
  },
  bindPlaceData: {
    action: bindPlaceDataAction,
    form: BindPlaceDataActionForm,
  },
  bindPlaceGeometry: {
    action: bindPlaceGeometryAction,
    form: BindPlaceDataActionForm,
  },
  changeLanguage: {
    action: changeLanguageAction,
    form: ChangeLanguageActionForm,
  },
  customJavascript: {
    action: customJavascriptAction,
    form: CustomJavascriptActionForm,
    flowForm: CustomJavascriptFlowActionForm,
  },
};
