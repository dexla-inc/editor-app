import isEqual from "lodash.isequal";

export const isSame = (prevProps: any, nextProps: any) => {
  return isEqual(prevProps.component.props, nextProps.component.props);
};
