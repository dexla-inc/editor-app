import { DebugActionForm } from "@/components/actions/DebugActionForm";
import { NavigationActionForm } from "@/components/actions/NavigationActionForm";
import { Router } from "next/router";

export const triggers = [
  "onClick",
  "onHover",
  "onDoubleClick",
  "onMount",
] as const;

export const actions = ["debug", "navigation"];

export type ActionTrigger = (typeof triggers)[number];

export type NavigationAction = {
  name: "navigation";
  pageId: string;
};

export type DebugAction = {
  name: "debug";
  message: string;
};

export type Action = {
  trigger: ActionTrigger;
  action: NavigationAction | DebugAction;
};

export const navigationAction = (
  action: NavigationAction,
  router: Router,
  e?: any
) => {
  const projectId = router.query.id as string;
  router.push(`/projects/${projectId}/editor/${action.pageId}`);
};

export const debugAction = (action: DebugAction, router: Router, e?: any) => {
  alert(action.message);
};

export const actionMapper = {
  debug: {
    action: debugAction,
    form: DebugActionForm,
  },
  navigation: {
    action: navigationAction,
    form: NavigationActionForm,
  },
};
