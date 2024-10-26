export const findElementById = (context: any, id: string) => {
  // find the element that start with id or data-id
  return (
    context.querySelector(`[id="${id}"]`) ||
    context.querySelector(`[data-id="${id}"]`)
  );
};
