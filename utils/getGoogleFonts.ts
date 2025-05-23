const baseURL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY}&sort=popularity`;

export type GoogleFont = {
  family: string;
  weights: string[];
};

export const getGoogleFonts = async (family?: string) => {
  const url = new URL(baseURL);
  if (family) {
    url.searchParams.append("family", family);
  }
  const res = await fetch(url.href);
  const data = await res.json();
  return data.items.map((item: any) => ({
    family: item.family,
    weights: item.variants.filter(
      (variant: string) => !variant.includes("italic"),
    ),
  })) as GoogleFont[];
};
