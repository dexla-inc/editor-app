type TokenData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

let tokenData: TokenData | null = null;
let expiryTime: Date | null = null;

// TODO: All endpoints and auth endpoints need to be part of some context
const accessTokenUrl = "https://api.avm-api.com/api/login/token";
const refreshTokenUrl = "https://api.avm-api.com/api/login/token/refresh";

async function fetchToken(url: string, data: any): Promise<TokenData> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenData?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const responseBody = await response.json();
    const expiresIn = responseBody["expiry"];

    // calculate expiry time
    expiryTime = new Date(Date.now() + expiresIn * 1000);

    return {
      accessToken: responseBody["access"],
      refreshToken: responseBody["refresh"],
      expiresIn: responseBody["expiry"],
    };
  } else {
    throw new Error(`Failed to fetch token: ${response.status}`);
  }
}

export async function getBearerToken(): Promise<string> {
  const now = new Date();

  if (!tokenData || !expiryTime || now >= expiryTime) {
    // token is expired or doesn't exist, fetch new one
    tokenData = await fetchToken(refreshTokenUrl, {
      accessToken: tokenData?.accessToken,
      refreshToken: tokenData?.refreshToken,
    });
  }

  return tokenData ? `Bearer ${tokenData.accessToken}` : "";
}

// Call this function after a store login action is created
export async function initializeToken(
  username: string,
  password: string
): Promise<void> {
  // use this function to initialize the token when the app starts
  tokenData = await fetchToken(accessTokenUrl, { username, password });
}
