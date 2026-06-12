import type { Plugin } from "@opencode-ai/plugin";

import { createVoiceState } from "./voice.js";
import { startDaemon } from "./daemon.js";

export const WhisperAnywherePlugin: Plugin = async ({ client }) => {
  const voice = createVoiceState();

  const daemon = startDaemon((text) => {
    if (voice.isEnabled() && text) {
      client.tui.appendPrompt({ body: { text } }).catch(() => {});
    }
  });

  return {
    "command.execute.before": async (input, output) => {
      if (input.command === "/voice") {
        const enabled = voice.toggle();
        await client.tui.showToast({
          body: {
            message: `Voice dictation ${enabled ? "enabled" : "disabled"}`,
            variant: "info",
          },
        });
        output.parts = [];
      }
    },
    dispose: async () => {
      await daemon.kill();
    },
  };
};

export default WhisperAnywherePlugin;
