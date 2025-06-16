// utils/authUtils.js
export function getTokenExpiration(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to ms
  } catch {
    return null;
  }
}
