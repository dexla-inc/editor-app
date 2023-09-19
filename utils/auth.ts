import { createClient } from "@propelauth/javascript";

const authClient = createClient({
  authUrl: process.env.NEXT_PUBLIC_AUTH_URL as string,
  enableBackgroundTokenRefresh: true,
});
