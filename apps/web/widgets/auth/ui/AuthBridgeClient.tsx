"use client";

import { useEffect } from "react";

import { navigateNative } from "@/shared";

export const AuthBridgeClient = ({
  isAuthRequired,
}: {
  isAuthRequired: boolean;
}) => {
  useEffect(() => {
    if (isAuthRequired && window.ReactNativeWebView) {
      navigateNative("/(auth)/login", "NOT_SESSION");
    }
  }, [isAuthRequired]);

  return null;
};
