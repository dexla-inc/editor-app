export type LanguageResponse = {
  default: LanguageInfo;
  languages: LanguageInfo[];
};

export type LanguageInfo = {
  description: string;
  code: Iso6391Codes;
};

export type LanguageCodes = {
  languages: Record<Iso6391Codes, string>;
};

export type LanguageParams = {
  default: string;
  languages: string[];
};

export enum Iso6391Codes {
  EN,
  FR,
  DE,
  ES,
  IT,
  NL,
  PL,
  PT,
  SV,
  TR,
  ZH,
}
