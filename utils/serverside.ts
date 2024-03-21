export function checkRefreshTokenExists(refreshToken: string | undefined) {
  if (!refreshToken || refreshToken.toString() === "undefined") {
    return false;
  }

  return true;
}
