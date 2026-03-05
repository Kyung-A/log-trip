export function navigateNative(
  path: string,
  type = "NAVIGATE",
  params?: { [key: string]: string },
) {
  if (typeof window === "undefined") return;

  if (!window.ReactNativeWebView) {
    return;
  }

  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: type,
      payload: {
        path,
        params,
      },
    }),
  );
}
