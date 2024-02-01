import { ThemeResponse } from "@/requests/themes/types";
import { UserRoles } from "@/utils/dashboardTypes";
import { ProjectTypes } from "@/utils/projectTypes";

export type RegionTypes = "FRANCE_CENTRAL" | "US_CENTRAL" | "UK_SOUTH";

export interface ProjectParams extends ProjectUpdateParams {
  id: string;
  companyId: string;
  description: string;
  type: ProjectTypes;
  industry?: string;
  similarCompany?: string;
  customCode?: string;
}

export type ProjectUpdateParams = {
  friendlyName?: string;
  region?: RegionTypes;
  domain?: string;
  subDomain?: string;
  customCode?: string;
  redirectSlug?: string;
};

export type ProjectResponse = {
  id: string;
  name: string;
  friendlyName: string;
  region: {
    type: RegionTypes;
    name: string;
  };
  type: ProjectTypes;
  industry: string;
  description: string;
  similarCompany: string;
  accessLevel: UserRoles;
  isOwner: boolean;
  deployed: boolean;
  domain: string;
  subDomain: string;
  homePageId?: string;
  customCode?: string;
  redirectSlug?: string;
  faviconUrl?: string;
  branding: ThemeResponse;
};

export type ProjectListResponse = {
  results: ProjectResponse[];
};

export type BrandingAITheme = {
  fontFamily: string;
  colors: {
    primary: {
      backgroundColor: string;
      textColor: string;
    };
    secondary: {
      backgroundColor: string;
      textColor: string;
    };
    tertiary: {
      backgroundColor: string;
      textColor: string;
    };
  };
  hasCompactButtons: boolean;
  focusRing: FocusRing;
  backgroundColor: string;
  cardStyle: CardStyle;
  loader: LoaderType;
};

export type CardStyle =
  | "ROUNDED"
  | "SQUARED"
  | "OUTLINED"
  | "ELEVATED"
  | "OUTLINED_ROUNDED"
  | "OUTLINED_SQUARED"
  | "OUTLINED_ELEVATED"
  | "ELEVATED_ROUNDED"
  | "ELEVATED_SQUARED"
  | "ELEVATED_OUTLINED_ROUNDED"
  | "ELEVATED_OUTLINED_SQUARED";

export type FocusRing = "DEFAULT" | "ON_BRAND_THIN" | "ON_BRAND_THICK";
export type LoaderType = "OVAL" | "BARS" | "DOTS";
