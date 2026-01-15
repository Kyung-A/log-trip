"use client";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef } from "react";

export default function Captcha() {
  const hcaptchaRef = useRef(null);

  const onVerificationSuccess = (token: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ token }));
  };

  return (
    <div className="w-full h-full p-6">
      <HCaptcha
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
        onVerify={onVerificationSuccess}
        ref={hcaptchaRef}
      />
    </div>
  );
}
