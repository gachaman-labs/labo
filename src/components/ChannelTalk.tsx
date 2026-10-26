"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

type ChannelIO = ((...args: unknown[]) => void) & { q?: unknown[][]; c?: (args: IArguments) => void };
declare global {
  interface Window {
    ChannelIO?: ChannelIO;
    ChannelIOInitialized?: boolean;
  }
}

const PLUGIN_KEY = process.env.NEXT_PUBLIC_CHANNEL_IO_PLUGIN_KEY;

// 플러그인 키가 없으면 아무것도 하지 않는다. 우하단 고정 버튼이 다른 CTA 와 겹치지 않도록
// 이 사이트에는 우하단에 다른 고정 요소를 두지 않는다.
export function ChannelTalk() {
  const locale = useLocale();

  useEffect(() => {
    if (!PLUGIN_KEY) return;
    if (!window.ChannelIO) {
      const ch: ChannelIO = function () {
        // eslint-disable-next-line prefer-rest-params
        ch.c?.(arguments);
      } as ChannelIO;
      ch.q = [];
      ch.c = (args) => ch.q?.push(Array.from(args));
      window.ChannelIO = ch;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
      document.head.appendChild(s);
    }
    window.ChannelIO?.("boot", { pluginKey: PLUGIN_KEY, language: locale === "ja" ? "ja" : "ko" });
    return () => window.ChannelIO?.("shutdown");
  }, [locale]);

  return null;
}
