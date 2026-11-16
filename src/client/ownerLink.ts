// The sender's private owner page, remembered on this device only.
const KEY = "mise_owner_url";

export function toPath(url: string) {
  return new URL(url, window.location.origin).pathname;
}

export function rememberOwnerUrl(url: string) {
  try {
    localStorage.setItem(KEY, url);
  } catch {
    // Storage blocked (private mode): the owner page still works, it just isn't remembered.
  }
}

export function ownerLinksPath(): string | null {
  try {
    const url = localStorage.getItem(KEY);
    return url ? toPath(url) : null;
  } catch {
    return null;
  }
}
