export function navigateNative(path: string, params?: any) {
  if (typeof window === "undefined") return;

  if (!(window as any).ReactNativeWebView) {
    return;
  }

  (window as any).ReactNativeWebView.postMessage(
    JSON.stringify({
      type: "NAVIGATE",
      payload: {
        path,
        params,
      },
    })
  );
}
