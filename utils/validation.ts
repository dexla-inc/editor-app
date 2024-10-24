export const requiredFieldValidator =
  (fieldName: string) => (value: string) => {
    if (!value) {
      return `${fieldName} is required`;
    }
    return null;
  };

export function isWebsite(value: string): boolean {
  // This regex checks for optional 'http://', 'https://', and 'www.', followed by
  // any non-space characters (which should be the domain name plus TLD), at least
  // one dot, and then more non-space characters (which should be the TLD).
  // It also enforces that the string does not contain spaces and ends with a TLD.
  const pattern =
    /^(?:(?:http:\/\/)|(?:https:\/\/))?(?:www\.)?[\w\-_]+(\.[\w\-_]+)+.*$/i;
  return pattern.test(value);
}

export function isSwaggerFile(url: string) {
  return url.endsWith("json") || url.endsWith("yaml") || url.endsWith("yml");
}

export function validateBaseUrl(value: string | undefined) {
  if (!value) {
    return "Base URL is required";
  } else if (!isWebsite(value)) {
    return "Base URL must be valid and preferably start with https://";
  } else {
    return null;
  }
}

export function validateName(value: string | undefined) {
  if (!value) {
    return "Name is required";
  } else if (value.length > 30) {
    return "Name must be 30 characters or less";
  } else {
    return null;
  }
}
