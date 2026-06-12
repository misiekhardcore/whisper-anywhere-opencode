import type { Plugin, TuiPlugin } from "@opencode-ai/plugin";

const createPlugin = () => {
  let voiceEnabled = true;

  const startDaemon = async (client: any) => {
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
  };

  return {
    getVoiceEnabled: () => voiceEnabled,
    toggleVoice: () => {
      voiceEnabled = !voiceEnabled;
      return voiceEnabled;
    },
    startDaemon,
  };
};

// Server plugin — hooks into server events
const server: Plugin = async ({ client }) => {
  const state = createPlugin();
  state.startDaemon(client);

  return {
    "command.execute.before": async (input, output) => {
      if (input.command === "/voice") {
        const enabled = state.toggleVoice();
        await client.tui.showToast({
          body: { message: `Voice dictation ${enabled ? "enabled" : "disabled"}`, variant: "info" },
        });
        output.parts = [];
      }
    },
    dispose: async () => {},
  };
};

// TUI plugin — satisfies desktop app loader, delegates to server plugin
const tui: TuiPlugin = async (api) => {
  const state = createPlugin();
  state.startDaemon(api.client);

  api.keymap.registerLayer({
    commands: [
      {
        title: "Toggle voice dictation",
        value: "voice.toggle",
        description: "Enable or disable voice dictation",
        slash: { name: "voice" },
        onSelect: () => {
          const enabled = state.toggleVoice();
          api.ui.toast({
            message: `Voice dictation ${enabled ? "enabled" : "disabled"}`,
            variant: "info",
          });
        },
      },
    ],
    bindings: [],
  });
};

export default server;
export { server, tui };
