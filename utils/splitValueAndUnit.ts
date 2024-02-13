export const splitValueAndUnit = (value: string): [number, string] | null => {
  const matches = value?.match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (matches && matches.length === 3) {
    const number = parseFloat(matches[1]);
    const unit = matches[2].trim();
    return [number, unit];
  }

  return null;
};
