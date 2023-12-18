import isEqual from "lodash.isequal";

export const isSame = (prevProps: any, nextProps: any) => {
  const { triggers: prevTriggers, ...prev } = prevProps.component.props;
  const { triggers: nextTriggers, ...next } = nextProps.component.props;

  return false;
};
