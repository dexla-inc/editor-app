import { initBaseAuth } from "@propelauth/node";

export const propelauth = initBaseAuth({
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL!,
  apiKey: process.env.PROPELAUTH_BACKEND_API_KEY!,
  manualTokenVerificationMetadata: {
    verifierKey: `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1Ew75zigVTgClL7Fb23g
    5cwN2Xf97zPknDIvDF7zgVTVDQ6Aj73bJo87rcCcxvp5OrzoXp0dvy3lJgFstkRB
    CtEZkfH9bwPClUZybhZYfVeWBBd8axWinyhQQhspGaZ4uyFJxkd+WCtKnJbOQgjG
    6I9pAD0KrEm42l+Q9l575StNEqOpsT2T0B1X4kzzAL418pIx4vQa83kZno7spW+P
    NPXWJ7ItQtlBnau+ZQhNGo5dB4nbbgWTZtehvXqFnoINw3Q3VkOqVRihMaHI0XOR
    Ed5SOfpfsWngRZEX4JmQQ+usKbzx1lPdceY+YdcZntLqIm2tQ5c7jZaJQBxNr8C+
    NwIDAQAB
    -----END PUBLIC KEY-----
    `,
    issuer: process.env.NEXT_PUBLIC_AUTH_URL!,
  },
});
