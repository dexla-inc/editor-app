export const matchQuery = (query: string, str: string): boolean => {
  const regex = new RegExp(query, "i");
  return regex.test(str);
};
