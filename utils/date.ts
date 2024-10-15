import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

function formatDate(date: Date, format: string, withTimeZone = false) {
  if (withTimeZone) {
    return new Date(date).toISOString();
  }
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

function convertToFormat(dateString: string, toFormat: string): string {
  // Try parsing the date as-is
  let date = dayjs(dateString);

  // If not valid, try parsing space-separated date
  if (!date.isValid()) {
    const [day, month, year] = dateString.split(" ");
    date = dayjs(`${year}-${month}-${day}`);
  }

  return date.isValid() ? date.format(toFormat) : dateString;
}

export const setDate = (
  date: string | Array<string>,
  type: string,
  format: string,
) => {
  const newDate = configureDate(date, type);

  // Convert valid dates to the specified format
  const formattedDate = Array.isArray(newDate)
    ? newDate.map((d) => convertToFormat(d, format))
    : newDate
      ? convertToFormat(newDate, format)
      : null;

  if (formattedDate) {
    return parseDates(formattedDate, format);
  }

  // If formattedDate is null or an empty array, return appropriate default value
  return type === "default" ? null : [];
};

const parseDates = (date: string | Array<string>, format: string) => {
  if (Array.isArray(date)) {
    return date.map((v) => parseDateString(v, format)).filter(Boolean);
  }
  return parseDateString(date, format);
};

const parseDateString = (date: string, format: string) => {
  const newDate = dayjs(date, format);
  return newDate.isValid() ? newDate.toDate() : null;
};

export const getNewDate = (
  date: Date | Date[],
  format: string,
  withTimeZone: boolean,
) => {
  if (Array.isArray(date)) {
    const newDate = date.filter((d) => !!d);
    return newDate.map((d) => formatDate(d, format, withTimeZone));
  }
  return formatDate(date, format, withTimeZone);
};
