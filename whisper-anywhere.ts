import type { Plugin } from "@opencode-ai/plugin";

export const WhisperAnywherePlugin: Plugin = async ({ client }) => {
  let voiceEnabled = true;

  const proc = Bun.spawn(["whisper-anywhere", "--stdout"], {
    stdout: "pipe",
    stderr: "inherit",
  });

  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  const readLoop = async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const { text } = JSON.parse(line);
          if (text && voiceEnabled) {
            await client.tui.appendPrompt({ body: { text } });
          }
        } catch {
          // skip malformed JSON
        }
      }
    }
  };

  readLoop();

  return {
    "command.execute.before": async (input, output) => {
      if (input.command === "/voice") {
        voiceEnabled = !voiceEnabled;
        const status = voiceEnabled ? "enabled" : "disabled";
        await client.tui.showToast({
          body: { message: `Voice dictation ${status}`, variant: "info" },
        });
        output.parts = [];
      }
    },
    dispose: async () => {
      proc.kill();
      await proc.exited;
    },
  };
};

export default WhisperAnywherePlugin;
