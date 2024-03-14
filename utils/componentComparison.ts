export const isSame = (prevProps: any, nextProps: any) => {
  // if (!nextProps.isPreviewMode) {
  //   return false;
  // }
  //
  // if (
  //   prevProps.id !== nextProps.id ||
  //   prevProps.isPreviewMode !== nextProps.isPreviewMode
  // ) {
  //   return false;
  // }
  //
  // // Compare the 'style' and 'sx' objects
  // if (
  //   JSON.stringify(prevProps.style) !== JSON.stringify(nextProps.style) ||
  //   JSON.stringify(prevProps.sx) !== JSON.stringify(nextProps.sx)
  // ) {
  //   return false;
  // }
  //
  // // Compare the 'shareableContent' objects
  // if (
  //   JSON.stringify(prevProps.shareableContent) !==
  //   JSON.stringify(nextProps.shareableContent)
  // ) {
  //   return false;
  // }
  //
  // // Deep compare the 'component' object
  // const prevComponent = prevProps.component;
  // const nextComponent = nextProps.component;
  //
  // // Compare the 'component' object's properties
  // if (
  //   prevComponent.id !== nextComponent.id ||
  //   prevComponent.name !== nextComponent.name ||
  //   prevComponent.dataType !== nextComponent.dataType ||
  //   JSON.stringify(prevComponent.props) !==
  //     JSON.stringify(nextComponent.props) ||
  //   JSON.stringify(prevComponent.states) !==
  //     JSON.stringify(nextComponent.states) ||
  //   JSON.stringify(prevComponent.actions) !==
  //     JSON.stringify(nextComponent.actions) ||
  //   JSON.stringify(prevComponent.onLoad) !==
  //     JSON.stringify(nextComponent.onLoad) ||
  //   JSON.stringify(prevComponent.languages) !==
  //     JSON.stringify(nextComponent.languages)
  // ) {
  //   return false;
  // }
  //
  // // TODO: this needs reviewing - we need a way of setting that the children are different
  // // const prevComponentChildrenIds =
  // //   prevComponent?.children?.map((child: Component) => child.id) ?? [];
  // // const nextComponentChildrenIds =
  // //   prevComponent?.children?.map((child: Component) => child.id) ?? [];
  // //
  // // if (
  // //   JSON.stringify(prevComponentChildrenIds) !==
  // //   JSON.stringify(nextComponentChildrenIds)
  // // ) {
  // //   return false;
  // // }
  //
  // // If all checks pass, the props are equal
  // return true;
  // FIXME: commenting it as it seems we dont need to use it anymore
  return false;
};
