import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

function formatDate(date: Date, format: string) {
  return dayjs(date).format(format);
}

function isDateInvalid(
  date: string | string[] | null,
  format: string,
): boolean {
  if (!date) {
    return true;
  }
  if (Array.isArray(date)) {
    return date.every((d) => !dayjs(d, format).isValid());
  }
  return !dayjs(date, format).isValid();
}

function configureDate(date: string | Array<string>, type: string) {
  let configuredDate: typeof date | null = date;
  if (type === "default" && Array.isArray(date)) {
    configuredDate = date[0] || null;
  }
  if (type !== "default" && !Array.isArray(date)) {
    configuredDate = [date];
  }
  return configuredDate;
}
export const setDate = (
  date: string | Array<string>,
  type: string,
  format: string,
) => {
  const newDate = configureDate(date, type);
  if (isDateInvalid(newDate, format)) {
    return type === "default" ? null : [];
  }
  if (newDate) {
    return parseDates(newDate, format);
  }
};

const parseDates = (date: string | Array<string>, format: string) => {
  if (Array.isArray(date)) {
    return date.map((v) => parseDateString(v, format));
  }
  return parseDateString(date, format);
};
const parseDateString = (date: string, format: string) => {
  const newDate = dayjs(date, format);
  return newDate.isValid() ? newDate.toDate() : null;
};

export const getNewDate = (date: Date | Date[], format: string) => {
  if (Array.isArray(date)) {
    const newDate = date.filter((d) => !!d);
    return newDate.map((d) => formatDate(d, format));
  }
  return formatDate(date, format);
};
