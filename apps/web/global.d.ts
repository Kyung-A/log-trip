export {};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    forceRefreshMap?: () => void;
  }
}
