"use client";
import { useRef } from "react";

import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Captcha() {
  const hcaptchaRef = useRef(null);

  const onVerificationSuccess = (token: string) => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ token }));
  };

  return (
    <div className="w-full h-full p-6">
      <p className="mb-2">인증을 마무리해주세요.</p>
      <HCaptcha
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
        onVerify={onVerificationSuccess}
        ref={hcaptchaRef}
      />
    </div>
  );
}
