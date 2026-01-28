import { jwtDecode } from "jwt-decode";

export function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}
