import React, { createContext, useContext, useRef } from "react";
import WebView from "react-native-webview";

interface WebviewRefContextType {
  mapWebviewRef: React.RefObject<WebView | null>;
  publicDiaryWebviewRef: React.RefObject<WebView | null>;
  diaryWebviewRef: React.RefObject<WebView | null>;
  mypageWebviewRef: React.RefObject<WebView | null>;
}

const WebviewRefContext = createContext<WebviewRefContextType | null>(null);

export const WebviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const mapWebviewRef = useRef<WebView>(null);
  const publicDiaryWebviewRef = useRef<WebView>(null);
  const diaryWebviewRef = useRef<WebView>(null);
  const mypageWebviewRef = useRef<WebView>(null);

  return (
    <WebviewRefContext.Provider
      value={{
        mapWebviewRef,
        publicDiaryWebviewRef,
        diaryWebviewRef,
        mypageWebviewRef,
      }}
    >
      {children}
    </WebviewRefContext.Provider>
  );
};

export const useWebviewRefs = () => {
  const context = useContext(WebviewRefContext);
  if (!context)
    throw new Error("useWebviewRefs must be used within a WebviewProvider");
  return context;
};
