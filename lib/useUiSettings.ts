"use client";

import { useCallback, useState } from "react";

/**
 * Global-ish UI preference toggles for the studio chrome. Kept intentionally
 * tiny and local (lifted into the page) so there is no context/provider
 * ceremony — the page passes these down to the panels that need them.
 */
export interface UiSettings {
  soundOn: boolean;
  scanlinesOn: boolean;
  gridAnimated: boolean;
}

const DEFAULTS: UiSettings = {
  soundOn: false, // off by default — audio requires an explicit user opt-in.
  scanlinesOn: true,
  gridAnimated: true,
};

export function useUiSettings() {
  const [settings, setSettings] = useState<UiSettings>(DEFAULTS);

  const toggle = useCallback((key: keyof UiSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { settings, toggle };
}
