/* eslint-disable @typescript-eslint/no-explicit-any */
export function navigateNative(path: string, type = "NAVIGATE", params?: any) {
  if (typeof window === "undefined") return;

  if (!(window as any).ReactNativeWebView) {
    return;
  }

  (window as any).ReactNativeWebView.postMessage(
    JSON.stringify({
      type: type,
      payload: {
        path,
        params,
      },
    })
  );
}
